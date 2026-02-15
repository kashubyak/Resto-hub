import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import {
	type IUserCreateInput,
	type IUserUpdateInput,
} from '../interfaces/prisma.interface'
import {
	type IFindUsersArgs,
	type IFindUsersResult,
	type IUserFullResultOrNull,
	type IUserRepositoryResult,
	type IUserRepositoryResultOrNull,
	type IUserWithCompanyIdResult,
} from '../interfaces/repository.interface'

const USER_BASE_SELECT = {
	id: true,
	name: true,
	email: true,
	role: true,
	avatarUrl: true,
	createdAt: true,
	updatedAt: true,
} as const

@Injectable()
export class UserRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createUser(
		data: IUserCreateInput,
		companyId: number,
	): Promise<IUserWithCompanyIdResult> {
		return this.prisma.user.create({
			data: {
				...data,
				companyId,
			},
			select: {
				...USER_BASE_SELECT,
				companyId: true,
			},
		}) as Promise<IUserWithCompanyIdResult>
	}

	async findManyWithCount(
		args: IFindUsersArgs,
	): Promise<IFindUsersResult<IUserWithCompanyIdResult>> {
		const { where, orderBy, skip, take } = args
		const [data, total] = await Promise.all([
			this.prisma.user.findMany({
				where,
				skip,
				take,
				orderBy,
				select: {
					...USER_BASE_SELECT,
					companyId: true,
				},
			}),
			this.prisma.user.count({ where }),
		])
		return {
			data: data as IUserWithCompanyIdResult[],
			total,
		}
	}

	async findUser(
		id: number,
		companyId: number,
	): Promise<IUserRepositoryResultOrNull> {
		return this.prisma.user.findFirst({
			where: { id, companyId },
			select: USER_BASE_SELECT,
		}) as Promise<IUserRepositoryResultOrNull>
	}

	async findUserWithSupabaseId(
		id: number,
		companyId: number,
	): Promise<
		(IUserRepositoryResult & { supabaseUserId: string | null }) | null
	> {
		const user = await this.prisma.user.findFirst({
			where: { id, companyId },
			select: { ...USER_BASE_SELECT, supabaseUserId: true } as never,
		})
		return user as
			| (IUserRepositoryResult & { supabaseUserId: string | null })
			| null
	}

	async updateUser(
		id: number,
		data: IUserUpdateInput,
		companyId: number,
	): Promise<IUserRepositoryResult> {
		return this.prisma.user.update({
			where: { id, companyId },
			data,
			select: USER_BASE_SELECT,
		}) as Promise<IUserRepositoryResult>
	}

	async findByEmail(
		email: string,
		companyId: number,
	): Promise<IUserFullResultOrNull> {
		return this.prisma.user.findFirst({
			where: { email, companyId },
		}) as Promise<IUserFullResultOrNull>
	}

	async deleteUser(
		id: number,
		companyId: number,
	): Promise<IUserRepositoryResultOrNull> {
		const user = await this.findUser(id, companyId)
		if (!user) return null
		await this.prisma.user.delete({
			where: { id, companyId },
		})
		return user
	}
}
