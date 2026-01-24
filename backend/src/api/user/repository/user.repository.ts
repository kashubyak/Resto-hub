import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'

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
	constructor(private readonly prisma: PrismaService) { }

	createUser(data: Prisma.UserUncheckedCreateInput, companyId: number) {
		return this.prisma.user.create({
			data: {
				...data,
				companyId,
			},
			select: {
				...USER_BASE_SELECT,
				companyId: true,
			},
		})
	}

	async findManyWithCount(args: {
		where?: Prisma.UserWhereInput
		orderBy?: Prisma.UserOrderByWithRelationInput
		skip: number
		take: number
	}) {
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
		return { data, total }
	}

	findUser(id: number, companyId: number) {
		return this.prisma.user.findFirst({
			where: { id, companyId },
			select: USER_BASE_SELECT,
		})
	}

	async updateUser(
		id: number,
		data: Prisma.UserUpdateInput,
		companyId: number,
	) {
		return this.prisma.user.update({
			where: { id, companyId },
			data,
			select: USER_BASE_SELECT,
		})
	}

	findUserWithPassword(id: number, companyId: number) {
		return this.prisma.user.findFirst({
			where: { id, companyId },
			select: {
				id: true,
				name: true,
				email: true,
				password: true,
				role: true,
				avatarUrl: true,
			},
		})
	}

	findByEmail(email: string, companyId: number) {
		return this.prisma.user.findUnique({
			where: {
				email_companyId: {
					email,
					companyId,
				},
			},
		})
	}

	async deleteUser(id: number, companyId: number) {
		const user = await this.findUser(id, companyId)
		if (!user) return null
		await this.prisma.user.delete({
			where: { id, companyId },
		})
		return user
	}
}
