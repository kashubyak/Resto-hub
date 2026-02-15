import {
	BadRequestException,
	ConflictException,
	Injectable,
} from '@nestjs/common'
import { Company, Role, User } from '@prisma/client'
import type { CookieOptions } from 'express'
import { Response } from 'express'
import { PrismaService } from 'prisma/prisma.service'
import { company_avatar, folder_avatar } from 'src/common/constants'
import { S3Service } from 'src/common/s3/s3.service'
import { SupabaseService } from 'src/common/supabase/supabase.service'
import { RegisterCompanyDto } from './dto/request/register-company.dto'
import { RegisterCompanyResponseDto } from './dto/response/register-company-response.dto'
import { ICompanyRegistrationFiles } from './interfaces/file-upload.interface'

const ACCESS_TOKEN_COOKIE = 'access_token'
const REFRESH_TOKEN_COOKIE = 'jid'
const AUTH_STATUS_COOKIE = 'is_authenticated'

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly supabase: SupabaseService,
		private readonly S3Service: S3Service,
	) {}

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

		const { data: supabaseUser, error: supabaseError } = await this.supabase
			.getClient()
			.auth.admin.createUser({
				email: dto.adminEmail,
				password: dto.adminPassword,
				email_confirm: true,
				user_metadata: { name: dto.adminName },
			})

		if (supabaseError) {
			if (supabaseError.message.includes('already been registered'))
				throw new ConflictException('Email already in use')
			throw new BadRequestException(supabaseError.message)
		}

		if (!supabaseUser.user.id)
			throw new BadRequestException('Failed to create Supabase user')

		const supabaseUserId = supabaseUser.user.id

		const company = await this.prisma.$transaction(async (tx) => {
			const existingCompany = await tx.company.findFirst({
				where: {
					OR: [{ name: dto.name }, { subdomain: dto.subdomain }],
				},
			})
			if (existingCompany)
				throw new ConflictException('Company name or subdomain already exists')

			const created: Company & { users: User[] } = await tx.company.create({
				data: {
					name: dto.name,
					subdomain: dto.subdomain,
					address: dto.address,
					latitude: dto.latitude,
					longitude: dto.longitude,
					logoUrl,
					users: {
						create: {
							supabaseUserId,
							name: dto.adminName,
							email: dto.adminEmail,
							role: Role.ADMIN,
							avatarUrl,
						},
					},
				},
				include: {
					users: true,
				},
			})
			return created
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
	logoutUser(res: Response): { message: string } {
		const isProd = process.env.NODE_ENV === 'production'
		const clearOptions: CookieOptions = {
			httpOnly: true,
			secure: isProd,
			sameSite: isProd ? 'strict' : 'lax',
			path: '/',
			maxAge: 0,
		}
		res.clearCookie(ACCESS_TOKEN_COOKIE, clearOptions)
		res.clearCookie(REFRESH_TOKEN_COOKIE, clearOptions)
		res.clearCookie(AUTH_STATUS_COOKIE, { ...clearOptions, httpOnly: false })
		return { message: 'Logged out successfully' }
	}
}
