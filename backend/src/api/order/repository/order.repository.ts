import { Injectable } from '@nestjs/common'
import { OrderStatus } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { OrderEntity } from '../entities/order.entity'
import { type IOrderWithRelations } from '../interfaces/order.interface'
import { type IOrderWhereInput } from '../interfaces/prisma.interface'
import {
	type IFindOrdersOptions,
	type IOrderBaseResult,
	type IOrderWithCookResult,
	type IOrderWithFullDetailsResult,
	type IOrderWithItemsForAnalyticsResult,
	type IOrderWithWaiterResult,
} from '../interfaces/repository.interface'

const ORDER_WITH_RELATIONS_INCLUDE = {
	waiter: { select: { id: true, name: true } },
	cook: { select: { id: true, name: true } },
	table: { select: { id: true, number: true } },
	orderItems: {
		select: {
			dish: { select: { id: true, name: true, price: true } },
			quantity: true,
			price: true,
			notes: true,
		},
	},
} as const

const ORDER_WITH_FULL_DETAILS_SELECT = {
	id: true,
	status: true,
	createdAt: true,
	updatedAt: true,
	waiter: { select: { id: true, name: true, email: true, role: true } },
	cook: { select: { id: true, name: true, email: true, role: true } },
	table: {
		select: { id: true, number: true, seats: true, active: true },
	},
	orderItems: {
		select: {
			quantity: true,
			price: true,
			notes: true,
			dish: {
				select: {
					id: true,
					name: true,
					description: true,
					price: true,
					imageUrl: true,
					ingredients: true,
					weightGr: true,
					calories: true,
					available: true,
				},
			},
		},
	},
} as const

const ORDER_WITH_FULL_DISH_INCLUDE = {
	waiter: { select: { id: true, name: true } },
	cook: { select: { id: true, name: true } },
	table: { select: { id: true, number: true } },
	orderItems: {
		select: {
			dish: {
				select: {
					id: true,
					name: true,
					description: true,
					price: true,
					imageUrl: true,
					ingredients: true,
					weightGr: true,
					calories: true,
					available: true,
				},
			},
			quantity: true,
			price: true,
			notes: true,
		},
	},
} as const

@Injectable()
export class OrderRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createOrder(order: OrderEntity): Promise<
		IOrderBaseResult & {
			orderItems: Array<{
				id: number
				orderId: number
				dishId: number
				quantity: number
				price: number
				notes: string | null
			}>
		}
	> {
		return this.prisma.order.create({
			data: {
				waiterId: order.waiterId,
				tableId: order.tableId,
				companyId: order.companyId,
				orderItems: {
					create: order.items.map((item) => ({
						dishId: item.dishId,
						quantity: item.quantity,
						price: item.price,
						notes: item.notes,
					})),
				},
			},
			include: {
				orderItems: true,
			},
		})
	}

	async getDishPrices(dishIds: number[], companyId: number) {
		const dishes = await this.prisma.dish.findMany({
			where: { id: { in: dishIds }, companyId },
			select: { id: true, price: true },
		})
		const priceMap = new Map<number, number>()
		for (const dish of dishes) priceMap.set(dish.id, dish.price)
		return priceMap
	}

	async findAll(
		where: IOrderWhereInput,
		options: IFindOrdersOptions,
	): Promise<IOrderWithRelations[]> {
		return this.prisma.order.findMany({
			where,
			skip: options.skip,
			take: options.take,
			orderBy: options.orderBy,
			include: ORDER_WITH_RELATIONS_INCLUDE,
		}) as Promise<IOrderWithRelations[]>
	}

	async count(where: IOrderWhereInput): Promise<number> {
		return this.prisma.order.count({ where })
	}

	async findById(
		id: number,
		companyId: number,
	): Promise<IOrderWithFullDetailsResult> {
		return this.prisma.order.findFirst({
			where: { id, companyId },
			select: ORDER_WITH_FULL_DETAILS_SELECT,
		}) as Promise<IOrderWithFullDetailsResult>
	}

	async findWithFullDish(
		where: IOrderWhereInput,
		options: IFindOrdersOptions,
	): Promise<IOrderWithRelations[]> {
		return this.prisma.order.findMany({
			where,
			skip: options.skip,
			take: options.take,
			orderBy: options.orderBy,
			include: ORDER_WITH_FULL_DISH_INCLUDE,
		}) as Promise<IOrderWithRelations[]>
	}
	async findPendingOrderWithCookById(
		id: number,
		companyId: number,
	): Promise<IOrderWithCookResult | null> {
		return this.prisma.order.findFirst({
			where: { id, status: OrderStatus.PENDING, companyId },
			include: { cook: true },
		}) as Promise<IOrderWithCookResult | null>
	}

	async findPendingOrderWithWaiterById(
		id: number,
		companyId: number,
	): Promise<IOrderWithWaiterResult | null> {
		return this.prisma.order.findFirst({
			where: { id, companyId },
			include: { waiter: true },
		}) as Promise<IOrderWithWaiterResult | null>
	}

	async assignCook(
		orderId: number,
		cookId: number,
		companyId: number,
	): Promise<IOrderBaseResult> {
		return this.prisma.order.update({
			where: { id: orderId, companyId },
			data: {
				cookId,
				status: OrderStatus.IN_PROGRESS,
				updatedAt: new Date(),
			},
		})
	}

	async cancelOrder(
		orderId: number,
		companyId: number,
	): Promise<IOrderBaseResult> {
		return this.prisma.order.update({
			where: { id: orderId, companyId },
			data: {
				status: OrderStatus.CANCELED,
				updatedAt: new Date(),
			},
		})
	}

	async updateStatus(
		orderId: number,
		status: OrderStatus,
		companyId: number,
	): Promise<IOrderBaseResult> {
		return this.prisma.order.update({
			where: { id: orderId, companyId },
			data: { status },
		})
	}

	async findOrdersWithItems(
		where: IOrderWhereInput,
	): Promise<IOrderWithItemsForAnalyticsResult> {
		return this.prisma.order.findMany({
			where,
			include: {
				waiter: true,
				cook: true,
				table: true,
				orderItems: {
					include: {
						dish: {
							include: {
								category: true,
							},
						},
					},
				},
			},
		}) as Promise<IOrderWithItemsForAnalyticsResult>
	}
}
