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
import { IJwtPayload, ITokenResponse } from './interfaces/jwt.interface'

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
	): Promise<ITokenResponse> {
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

		const token = await this.getAccessToken(user.id, user.role)
		const refreshToken = await this.getRefreshToken(user.id, user.role)
		this.setRefreshTokenCookie(res, refreshToken)
		return { token }
	}

	async processRefresh(
		req: IRequestWithCompanyId,
		res: Response,
	): Promise<ITokenResponse> {
		const refreshToken = req.cookies['jid']
		if (!refreshToken)
			throw new UnauthorizedException('No refresh token provided')

		let payload: IJwtPayload
		try {
			payload = await this.jwtService.verifyAsync(refreshToken, {
				secret: this.JWT_REFRESH_TOKEN_SECRET,
			})
		} catch {
			throw new UnauthorizedException('Invalid refresh token')
		}

		const token = await this.getAccessToken(payload.sub, payload.role)
		const newRefreshToken = await this.getRefreshToken(
			payload.sub,
			payload.role,
		)
		this.setRefreshTokenCookie(res, newRefreshToken)

		return { token }
	}

	logoutUser(res: Response): { message: string } {
		res.clearCookie('jid', { path: '/', httpOnly: true })
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

	private setRefreshTokenCookie(res: Response, refreshToken: string): void {
		const isProd = process.env.NODE_ENV === 'production'
		res.cookie('jid', refreshToken, {
			httpOnly: true,
			secure: isProd,
			sameSite: isProd ? 'strict' : 'lax',
			...(isProd ? { domain: `.${process.env.DOMAIN}` } : {}),
			path: '/',
			maxAge: 30 * 24 * 60 * 60 * 1000,
		})
	}
}
