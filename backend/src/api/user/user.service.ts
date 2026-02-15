import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { Role } from '@prisma/client'
import { folder_avatar } from 'src/common/constants'
import { type IPaginatedResponse } from 'src/common/interface/pagination.interface'
import { SupabaseService } from 'src/common/supabase/supabase.service'
import { S3Service } from 'src/common/s3/s3.service'
import { RegisterDto } from '../auth/dto/request/register.dto'
import { FilterUserDto } from './dto/request/filter-user.dto'
import { UpdateUserDto } from './dto/request/update-user.dto'
import { type IUserWhereInput } from './interfaces/prisma.interface'
import {
	type IUserRepositoryResult,
	type IUserWithCompanyIdResult,
} from './interfaces/repository.interface'
import { UserRepository } from './repository/user.repository'

@Injectable()
export class UserService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly supabase: SupabaseService,
		private readonly s3Service: S3Service,
	) {}

	async registerUser(
		dto: RegisterDto,
		file: Express.Multer.File | undefined,
		companyId: number,
	): Promise<IUserRepositoryResult> {
		if (!file) throw new BadRequestException('Avatar image is required')
		const existingUser = await this.userRepository.findByEmail(
			dto.email,
			companyId,
		)
		if (existingUser) throw new BadRequestException('Email already exists')
		if (dto.role === Role.ADMIN)
			throw new BadRequestException('Cannot assign ADMIN role')

		const { data: supabaseUser, error: supabaseError } = await this.supabase
			.getClient()
			.auth.admin.createUser({
				email: dto.email,
				password: dto.password,
				email_confirm: true,
				user_metadata: { name: dto.name },
			})
		if (supabaseError) {
			if (supabaseError.message.includes('already been registered'))
				throw new BadRequestException('Email already exists')
			throw new BadRequestException(supabaseError.message)
		}
		if (!supabaseUser.user.id)
			throw new BadRequestException('Failed to create Supabase user')

		const avatarUrl = await this.s3Service.uploadFile(file, folder_avatar)
		const user = await this.userRepository.createUser(
			{
				supabaseUserId: supabaseUser.user.id,
				name: dto.name,
				email: dto.email,
				role: dto.role,
				avatarUrl,
			} as never,
			companyId,
		)

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
			avatarUrl: user.avatarUrl,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		}
	}

	async findAll(
		query: FilterUserDto,
		companyId: number,
	): Promise<IPaginatedResponse<IUserWithCompanyIdResult>> {
		const {
			search,
			role,
			sortBy = 'createdAt',
			order = 'desc',
			page: rawPage,
			limit: rawLimit,
		} = query

		const page = rawPage ?? 1
		const limit = rawLimit ?? 10
		const skip = (page - 1) * limit

		const allowedRoles: Role[] = ['COOK', 'WAITER']
		const where: IUserWhereInput = {
			companyId,
			role: role ?? { in: allowedRoles },
			...(search && {
				OR: [
					{ name: { contains: search, mode: 'insensitive' } },
					{ email: { contains: search, mode: 'insensitive' } },
				],
			}),
		}
		const { data, total } = await this.userRepository.findManyWithCount({
			where,
			orderBy: { [sortBy]: order },
			skip,
			take: limit,
		})

		return {
			data,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		}
	}

	async findById(
		id: number,
		companyId: number,
	): Promise<IUserRepositoryResult> {
		const user = await this.userRepository.findUser(id, companyId)
		if (!user) throw new NotFoundException(`User with ID ${id} not found`)
		return user
	}

	async updateUser(
		id: number,
		dto: UpdateUserDto,
		file: Express.Multer.File | undefined,
		companyId: number,
	): Promise<IUserRepositoryResult> {
		const user = await this.userRepository.findUserWithSupabaseId(id, companyId)
		if (!user) throw new NotFoundException(`User with ID ${id} not found`)

		if (dto.role === Role.ADMIN)
			throw new BadRequestException('Cannot assign ADMIN role')

		if (dto.email && dto.email !== user.email) {
			const existingEmail = await this.userRepository.findByEmail(
				dto.email,
				companyId,
			)
			if (existingEmail) throw new BadRequestException('Email already exists')
		}

		if (dto.password && user.supabaseUserId) {
			const { error } = await this.supabase
				.getClient()
				.auth.admin.updateUserById(user.supabaseUserId, {
					password: dto.password,
				})
			if (error) throw new BadRequestException(error.message)
		}

		let avatarUrl = user.avatarUrl
		if (file) {
			if (avatarUrl) await this.s3Service.deleteFile(avatarUrl)
			avatarUrl = await this.s3Service.uploadFile(file, folder_avatar)
		}

		const { oldPassword: _oldPassword, password: _password, ...safeData } = dto
		return this.userRepository.updateUser(
			id,
			{
				...safeData,
				avatarUrl,
			},
			companyId,
		)
	}

	async deleteUser(
		id: number,
		companyId: number,
	): Promise<IUserRepositoryResult> {
		const user = await this.userRepository.findUser(id, companyId)
		if (!user) throw new NotFoundException(`User with ID ${id} not found`)
		if (user.avatarUrl) {
			try {
				await this.s3Service.deleteFile(user.avatarUrl)
			} catch {
				throw new BadRequestException('Failed to delete avatar image')
			}
		}
		const deletedUser = await this.userRepository.deleteUser(id, companyId)
		if (!deletedUser)
			throw new NotFoundException(`User with ID ${id} not found`)
		return deletedUser
	}
}
