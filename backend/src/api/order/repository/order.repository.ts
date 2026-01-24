import { Injectable } from '@nestjs/common'
import { OrderStatus, Prisma } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { OrderEntity } from '../entities/order.entity'

@Injectable()
export class OrderRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createOrder(order: OrderEntity) {
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
		where: Prisma.OrderWhereInput,
		options: { skip: number; take: number; orderBy: any },
	) {
		return this.prisma.order.findMany({
			where,
			skip: options.skip,
			take: options.take,
			orderBy: options.orderBy,
			include: {
				waiter: { select: { id: true, name: true } },
				cook: { select: { id: true, name: true } },
				table: { select: { id: true, number: true } },
				orderItems: {
					select: {
						dish: { select: { id: true, name: true, price: true } },
						quantity: true,
						notes: true,
					},
				},
			},
		})
	}

	async count(where: Prisma.OrderWhereInput) {
		return this.prisma.order.count({ where })
	}

	async findById(id: number, companyId: number) {
		return this.prisma.order.findFirst({
			where: { id, companyId },
			select: {
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
			},
		})
	}

	async findWithFullDish(
		where: Prisma.OrderWhereInput,
		options: { skip: number; take: number; orderBy: any },
	) {
		return this.prisma.order.findMany({
			where,
			skip: options.skip,
			take: options.take,
			orderBy: options.orderBy,
			include: {
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
						notes: true,
					},
				},
			},
		})
	}
	async findPendingOrderWithCookById(id: number, companyId: number) {
		return this.prisma.order.findFirst({
			where: { id, status: OrderStatus.PENDING, companyId },
			include: { cook: true },
		})
	}

	async findPendingOrderWithWaiterById(id: number, companyId: number) {
		return this.prisma.order.findFirst({
			where: { id, companyId },
			include: { waiter: true },
		})
	}

	async assignCook(orderId: number, cookId: number, companyId: number) {
		return this.prisma.order.update({
			where: { id: orderId, companyId },
			data: {
				cookId,
				status: OrderStatus.IN_PROGRESS,
				updatedAt: new Date(),
			},
		})
	}

	async cancelOrder(orderId: number, companyId: number) {
		return this.prisma.order.update({
			where: { id: orderId, companyId },
			data: {
				status: OrderStatus.CANCELED,
				updatedAt: new Date(),
			},
		})
	}

	async updateStatus(orderId: number, status: OrderStatus, companyId: number) {
		return this.prisma.order.update({
			where: { id: orderId, companyId },
			data: { status },
		})
	}

	async findOrdersWithItems(where: Prisma.OrderWhereInput) {
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
		})
	}
}
