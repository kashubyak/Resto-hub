import {
	BadRequestException,
	ConflictException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Role } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { Response } from 'express'
import { PrismaService } from 'prisma/prisma.service'
import { company_avatar, folder_avatar } from 'src/common/constants'
import { IRequestWithCompanyId } from 'src/common/interface/request.interface'
import { S3Service } from 'src/common/s3/s3.service'
import { LoginDto } from './dto/request/login.dto'
import { RegisterCompanyDto } from './dto/request/register-company.dto'
import { RegisterCompanyResponseDto } from './dto/response/register-company-response.dto'
import { ICompanyRegistrationFiles } from './interfaces/file-upload.interface'
import { IAuthResponse, IJwtPayload } from './interfaces/jwt.interface'

const ACCESS_TOKEN_COOKIE = 'access_token'
const REFRESH_TOKEN_COOKIE = 'jid'
const AUTH_STATUS_COOKIE = 'is_authenticated'
const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000

@Injectable()
export class AuthService {
	private readonly JWT_SECRET: string
	private readonly JWT_REFRESH_TOKEN_SECRET: string
	private readonly JWT_EXPIRES_IN: string
	private readonly JWT_REFRESH_EXPIRES_IN: string

	constructor(
		private readonly prisma: PrismaService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly S3Service: S3Service,
	) {
		this.JWT_SECRET = this.configService.getOrThrow('JWT_TOKEN_SECRET')
		this.JWT_REFRESH_TOKEN_SECRET = this.configService.getOrThrow(
			'JWT_REFRESH_TOKEN_SECRET',
		)
		this.JWT_EXPIRES_IN = this.configService.getOrThrow('JWT_EXPIRES_IN')
		this.JWT_REFRESH_EXPIRES_IN = this.configService.getOrThrow(
			'JWT_REFRESH_EXPIRES_IN',
		)
	}

	async registerCompany(
		dto: RegisterCompanyDto,
		files: ICompanyRegistrationFiles,
		_res: Response,
	): Promise<Omit<RegisterCompanyResponseDto, 'refresh_token'>> {
		const logo = files.logoUrl?.[0]
		const avatar = files.avatarUrl?.[0]
		if (!logo || !avatar)
			throw new BadRequestException('Logo and avatar are required')

		const logoUrl = await this.S3Service.uploadFile(logo, company_avatar)
		const avatarUrl = await this.S3Service.uploadFile(avatar, folder_avatar)
		const hashedPassword = await bcrypt.hash(dto.adminPassword, 10)

		const company = await this.prisma.$transaction(async (tx) => {
			const existing = await tx.user.findFirst({
				where: { email: dto.adminEmail },
			})
			if (existing) throw new ConflictException('Email already in use')

			const existingCompany = await tx.company.findFirst({
				where: {
					OR: [{ name: dto.name }, { subdomain: dto.subdomain }],
				},
			})
			if (existingCompany)
				throw new ConflictException('Company name or subdomain already exists')

			return tx.company.create({
				data: {
					name: dto.name,
					subdomain: dto.subdomain,
					address: dto.address,
					latitude: dto.latitude,
					longitude: dto.longitude,
					logoUrl,
					users: {
						create: {
							name: dto.adminName,
							email: dto.adminEmail,
							password: hashedPassword,
							role: Role.ADMIN,
							avatarUrl,
						},
					},
				},
				include: {
					users: true,
				},
			})
		})

		const admin = company.users[0]
		if (!admin) throw new Error('Admin not found')
		return {
			user: {
				id: admin.id,
				name: admin.name,
				email: admin.email,
				role: admin.role,
				avatarUrl: admin.avatarUrl,
			},
		}
	}
	async processLogin(
		dto: LoginDto,
		req: IRequestWithCompanyId,
		res: Response,
	): Promise<IAuthResponse> {
		const companyId = req.companyIdFromSubdomain
		if (!companyId)
			throw new UnauthorizedException('Company subdomain not found')

		const user = await this.prisma.user.findUnique({
			where: {
				email_companyId: {
					email: dto.email,
					companyId,
				},
			},
		})

		if (!user || !(await bcrypt.compare(dto.password, user.password)))
			throw new UnauthorizedException('Invalid credentials')

		const accessToken = await this.getAccessToken(user.id, user.role)
		const refreshToken = await this.getRefreshToken(user.id, user.role)

		this.setAccessTokenCookie(res, accessToken)
		this.setRefreshTokenCookie(res, refreshToken)
		this.setAuthStatusCookie(res)

		return {
			success: true,
			user: { id: user.id, role: user.role },
		}
	}

	async processRefresh(
		req: IRequestWithCompanyId,
		res: Response,
	): Promise<IAuthResponse> {
		const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE] as string | undefined
		if (!refreshToken || typeof refreshToken !== 'string')
			throw new UnauthorizedException('No refresh token provided')

		let payload: IJwtPayload
		try {
			payload = await this.jwtService.verifyAsync(refreshToken, {
				secret: this.JWT_REFRESH_TOKEN_SECRET,
			})
		} catch {
			throw new UnauthorizedException('Invalid refresh token')
		}

		const user = await this.prisma.user.findUnique({
			where: { id: payload.sub },
			select: { id: true, role: true },
		})
		if (!user) {
			this.clearAllAuthCookies(res)
			throw new UnauthorizedException('User not found')
		}

		const accessToken = await this.getAccessToken(user.id, user.role)
		const newRefreshToken = await this.getRefreshToken(user.id, user.role)

		this.setAccessTokenCookie(res, accessToken)
		this.setRefreshTokenCookie(res, newRefreshToken)
		this.setAuthStatusCookie(res)

		return {
			success: true,
			user: { id: user.id, role: user.role },
		}
	}

	logoutUser(res: Response): { message: string } {
		this.clearAllAuthCookies(res)
		return { message: 'Logged out successfully' }
	}

	private async getAccessToken(userId: number, role: Role): Promise<string> {
		const payload: IJwtPayload = { sub: userId, role }
		return this.jwtService.signAsync(payload, {
			secret: this.JWT_SECRET,
			expiresIn: this.JWT_EXPIRES_IN,
		})
	}

	private async getRefreshToken(userId: number, role: Role): Promise<string> {
		const payload: IJwtPayload = { sub: userId, role }
		return this.jwtService.signAsync(payload, {
			secret: this.JWT_REFRESH_TOKEN_SECRET,
			expiresIn: this.JWT_REFRESH_EXPIRES_IN,
		})
	}

	private getCookieOptions(httpOnly: boolean, maxAge: number) {
		const isProd = process.env.NODE_ENV === 'production'
		return {
			httpOnly,
			secure: isProd,
			sameSite: (isProd ? 'strict' : 'lax') as 'strict' | 'lax',
			...(isProd ? { domain: `.${process.env.DOMAIN}` } : {}),
			path: '/',
			maxAge,
		}
	}

	private setAccessTokenCookie(res: Response, accessToken: string): void {
		res.cookie(
			ACCESS_TOKEN_COOKIE,
			accessToken,
			this.getCookieOptions(true, ACCESS_TOKEN_MAX_AGE),
		)
	}

	private setRefreshTokenCookie(res: Response, refreshToken: string): void {
		res.cookie(
			REFRESH_TOKEN_COOKIE,
			refreshToken,
			this.getCookieOptions(true, REFRESH_TOKEN_MAX_AGE),
		)
	}

	private setAuthStatusCookie(res: Response): void {
		res.cookie(
			AUTH_STATUS_COOKIE,
			'true',
			this.getCookieOptions(false, ACCESS_TOKEN_MAX_AGE),
		)
	}

	private clearAllAuthCookies(res: Response): void {
		const clearOptions = this.getCookieOptions(true, 0)
		res.clearCookie(ACCESS_TOKEN_COOKIE, clearOptions)
		res.clearCookie(REFRESH_TOKEN_COOKIE, clearOptions)
		res.clearCookie(AUTH_STATUS_COOKIE, { ...clearOptions, httpOnly: false })
	}
}
