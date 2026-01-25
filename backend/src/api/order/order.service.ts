import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { Order, OrderStatus, Role } from '@prisma/client'
import { endOfDay } from 'date-fns'
import { socket_events } from 'src/common/constants'
import { type IPaginatedResponse } from 'src/common/interface/pagination.interface'
import { TableService } from '../table/table.service'
import { CreateOrderDto } from './dto/request/create-order.dto'
import {
	OrderAnalyticsQueryDto,
	OrderGroupBy,
	OrderMetric,
} from './dto/request/order-analytics-query.dto'
import { OrdersQueryDto } from './dto/request/orders-query.dto'
import { OrderEntity } from './entities/order.entity'
import { NotificationsGateway } from './gateway/notification.gateway'
import {
	type IGroupedOrders,
	type IGroupInfo,
	type IOrderAnalyticsResult,
} from './interfaces/analytics.interface'
import {
	type INewOrderNotification,
	type IOrderCompletedNotification,
} from './interfaces/notification.interface'
import {
	type IOrderItemSummary,
	type IOrderSummary,
	type IOrderWithFullDetails,
	type IOrderWithItemsForAnalytics,
	type IOrderWithRelations,
} from './interfaces/order.interface'
import { type IOrderWhereInput } from './interfaces/prisma.interface'
import { OrderRepository } from './repository/order.repository'

@Injectable()
export class OrderService {
	constructor(
		private readonly orderRepo: OrderRepository,
		private readonly notificationsGateway: NotificationsGateway,
		private readonly tableService: TableService,
	) {}
	private mapSummary = (
		order: IOrderWithRelations | IOrderWithFullDetails,
	): IOrderSummary => {
		const summarizedItems: IOrderItemSummary[] = order.orderItems.map(
			(item) => ({
				price: item.price,
				quantity: item.quantity,
				total: item.price * item.quantity,
				notes: item.notes,
				dish: {
					id: item.dish.id,
					name: item.dish.name,
					price: item.dish.price,
				},
			}),
		)

		const total = summarizedItems.reduce((sum, item) => sum + item.total, 0)

		return {
			id: order.id,
			status: order.status,
			createdAt: order.createdAt,
			updatedAt: order.updatedAt,
			total,
			waiter: order.waiter ?? null,
			cook: order.cook ?? null,
			table: order.table ?? null,
			orderItems: summarizedItems,
		}
	}

	private buildFilters(query: OrderAnalyticsQueryDto): IOrderWhereInput {
		const where: IOrderWhereInput = {}
		if (query.from || query.to) {
			where.createdAt = {}
			if (query.from) where.createdAt.gte = new Date(query.from)
			if (query.to) where.createdAt.lte = endOfDay(new Date(query.to))
		}
		if (query.waiterIds?.length) where.waiterId = { in: query.waiterIds }
		if (query.cookIds?.length) where.cookId = { in: query.cookIds }
		if (query.tableIds?.length) where.tableId = { in: query.tableIds }
		if (query.dishIds?.length || query.categoryIds?.length)
			where.orderItems = {
				some: {
					...(query.dishIds?.length && { dishId: { in: query.dishIds } }),
					...(query.categoryIds?.length && {
						dish: { categoryId: { in: query.categoryIds } },
					}),
				},
			}
		return where
	}

	private groupOrders(
		orders: IOrderWithItemsForAnalytics[],
		groupBy?: OrderGroupBy,
	): IGroupedOrders {
		const grouped: IGroupedOrders = {}
		if (groupBy === OrderGroupBy.CATEGORY) {
			for (const order of orders) {
				for (const item of order.orderItems) {
					const category = item.dish.category
					const key = category?.name ?? 'Unknown Category'

					grouped[key] ??= []
					const filteredOrder = {
						...order,
						orderItems: [item],
					}
					grouped[key].push(filteredOrder)
				}
			}
			return grouped
		}

		for (const order of orders) {
			let key: string = 'total'
			if (groupBy === OrderGroupBy.DAY)
				key = new Date(order.createdAt).toISOString().split('T')[0] ?? 'total'
			else if (groupBy === OrderGroupBy.MONTH)
				key = `${order.createdAt.getFullYear()}-${order.createdAt.getMonth() + 1}`
			else if (groupBy === OrderGroupBy.WAITER) key = order.waiter.name
			else if (groupBy === OrderGroupBy.COOK)
				key = order.cook?.name ?? 'Unknown'
			else if (groupBy === OrderGroupBy.TABLE)
				key = `Table ${order.table?.number ?? 'Unknown'}`
			else if (groupBy === OrderGroupBy.DISH)
				key = order.orderItems[0]?.dish.name ?? 'Unknown Dish'

			const groupArray = grouped[key] ?? []
			groupArray.push(order)
			grouped[key] = groupArray
		}

		return grouped
	}

	private extractGroupInfo(
		orders: IOrderWithItemsForAnalytics[],
		groupBy?: OrderGroupBy,
	): IGroupInfo {
		if (!orders.length) return {}
		const firstOrder = orders[0]
		if (!firstOrder) return {}
		if (groupBy === OrderGroupBy.WAITER && firstOrder.waiterId)
			return { id: firstOrder.waiter.id, name: firstOrder.waiter.name }
		if (groupBy === OrderGroupBy.COOK && firstOrder.cookId && firstOrder.cook)
			return { id: firstOrder.cook.id, name: firstOrder.cook.name }

		if (
			groupBy === OrderGroupBy.TABLE &&
			firstOrder.tableId &&
			firstOrder.table
		)
			return {
				id: firstOrder.table.id,
				name: `Table ${firstOrder.table.number}`,
			}

		if (groupBy === OrderGroupBy.DISH) {
			const dish = firstOrder.orderItems[0]?.dish
			if (dish) {
				return {
					id: dish.id,
					name: dish.name,
					...(dish.category?.name && { category: dish.category.name }),
					...(dish.category?.id && { categoryId: dish.category.id }),
				}
			}
			return {}
		}
		if (groupBy === OrderGroupBy.CATEGORY) {
			const firstItem = orders[0]?.orderItems[0]
			const category = firstItem?.dish.category
			if (category) {
				return {
					id: category.id,
					name: category.name,
				}
			}
		}

		return {}
	}

	async createOrder(waiterId: number, dto: CreateOrderDto, companyId: number) {
		const dishIds = dto.items.map((item) => item.dishId)
		const priceMap = await this.orderRepo.getDishPrices(dishIds, companyId)
		const table = await this.tableService.getTableById(dto.tableId, companyId)
		if (table.active === false)
			throw new ConflictException('Table is occupied now')
		if (priceMap.size !== dishIds.length)
			throw new BadRequestException('Some dishes not found')

		const items = dto.items.map((item) => {
			const price = priceMap.get(item.dishId)
			if (price === undefined) {
				throw new BadRequestException(`Price not found for dish ${item.dishId}`)
			}
			return {
				dishId: item.dishId,
				quantity: item.quantity,
				price,
				...(item.notes && { notes: item.notes }),
			}
		})

		const order = new OrderEntity(waiterId, dto.tableId, items, companyId)

		const createdOrder = await this.orderRepo.createOrder(order)
		await this.tableService.updateTable(
			dto.tableId,
			{ active: false },
			companyId,
		)
		const notification: INewOrderNotification = {
			id: createdOrder.id,
			itemsCount: order.items.length,
			createdAt: createdOrder.createdAt,
		}
		this.notificationsGateway.notifyKitchen(
			socket_events.NEW_ORDER,
			notification,
		)

		return createdOrder
	}

	async getAllOrders(
		query: OrdersQueryDto,
		companyId: number,
	): Promise<IPaginatedResponse<IOrderSummary>> {
		const {
			status,
			from,
			to,
			waiterId,
			cookId,
			tableId,
			page = 1,
			limit = 10,
			sortBy = 'createdAt',
			order = 'desc',
		} = query

		const where: IOrderWhereInput = { companyId }
		if (status) where.status = status
		if (waiterId) where.waiterId = waiterId
		if (cookId) where.cookId = cookId
		if (tableId) where.tableId = tableId
		if (from || to) {
			where.createdAt = {}
			if (from) where.createdAt.gte = new Date(from)
			if (to) where.createdAt.lte = new Date(to)
		}

		const skip = (page - 1) * limit

		const [orders, total] = await Promise.all([
			this.orderRepo.findAll(where, {
				skip,
				take: limit,
				orderBy: { [sortBy]: order },
			}),
			this.orderRepo.count(where),
		])

		const summarizedOrders = orders.map(this.mapSummary)

		return {
			data: summarizedOrders,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		}
	}

	async getOrderHistory(
		userId: number,
		role: Role,
		query: OrdersQueryDto,
		companyId: number,
	): Promise<IPaginatedResponse<IOrderSummary>> {
		const where: IOrderWhereInput = {
			companyId,
			status: {
				in: [OrderStatus.COMPLETE, OrderStatus.DELIVERED, OrderStatus.CANCELED],
			},
		}
		if (role === Role.WAITER) where.waiterId = userId
		if (role === Role.COOK) where.cookId = userId

		const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = query
		const skip = (page - 1) * limit

		const [orders, total] = await Promise.all([
			this.orderRepo.findAll(where, {
				skip,
				take: limit,
				orderBy: { [sortBy]: order },
			}),
			this.orderRepo.count(where),
		])

		const summarizedOrders = orders.map(this.mapSummary)

		return {
			data: summarizedOrders,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		}
	}

	async getFreeOrders(
		query: OrdersQueryDto,
		companyId: number,
	): Promise<IPaginatedResponse<IOrderSummary>> {
		const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = query

		const where: IOrderWhereInput = {
			cookId: null,
			status: OrderStatus.PENDING,
			companyId,
		}
		const skip = (page - 1) * limit

		const [orders, total] = await Promise.all([
			this.orderRepo.findWithFullDish(where, {
				skip,
				take: limit,
				orderBy: { [sortBy]: order },
			}),
			this.orderRepo.count(where),
		])

		const summarizedOrders = orders.map(this.mapSummary)

		return {
			data: summarizedOrders,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		}
	}

	async getOrderById(id: number, companyId: number) {
		const order = await this.orderRepo.findById(id, companyId)
		if (!order) throw new NotFoundException(`Order with id ${id} not found`)
		return this.mapSummary(order)
	}

	async assignOrderToCook(orderId: number, cookId: number, companyId: number) {
		const order = await this.orderRepo.findPendingOrderWithCookById(
			orderId,
			companyId,
		)
		if (!order) throw new NotFoundException('Order not found')
		if (order.status !== OrderStatus.PENDING)
			throw new BadRequestException('Only pending orders can be assigned')
		if (order.cookId && order.cookId !== cookId)
			throw new BadRequestException('Order already assigned to another cook')
		const updatedOrder = await this.orderRepo.assignCook(
			orderId,
			cookId,
			companyId,
		)
		return updatedOrder
	}

	async cancelOrder(orderId: number, waiterId: number, companyId: number) {
		const order = await this.orderRepo.findPendingOrderWithWaiterById(
			orderId,
			companyId,
		)
		if (!order) throw new NotFoundException('Order not found')
		if (order.status !== OrderStatus.PENDING)
			throw new BadRequestException('Only pending orders can be canceled')
		if (order.waiterId && order.waiterId !== waiterId)
			throw new BadRequestException(
				'Only the waiter who created the order can cancel it',
			)
		const updatedOrder = await this.orderRepo.cancelOrder(orderId, companyId)
		return updatedOrder
	}

	async updateOrderStatus(
		orderId: number,
		userId: number,
		role: Role,
		newStatus: OrderStatus,
		companyId: number,
	): Promise<Order> {
		const order = await this.orderRepo.findById(orderId, companyId)
		if (!order) throw new NotFoundException('Order not found')
		if (role === Role.COOK) {
			if (newStatus !== OrderStatus.COMPLETE)
				throw new BadRequestException('Cook can only set status to COMPLETE')
			if (order.cook?.id !== userId)
				throw new BadRequestException('You are not assigned to this order')
			if (order.status !== OrderStatus.IN_PROGRESS)
				throw new BadRequestException('Order must be IN_PROGRESS to complete')
			if (!order.waiter)
				throw new BadRequestException('Order has no assigned waiter')
			const update = this.orderRepo.updateStatus(orderId, newStatus, companyId)

			const notification: IOrderCompletedNotification = {
				orderId,
				status: newStatus,
				table: order.table?.number ?? null,
			}
			this.notificationsGateway.notifyWaiter(
				socket_events.ORDER_COMPLETED,
				notification,
				order.waiter.id,
			)
			return update
		}
		if (role === Role.WAITER) {
			if (order.waiter?.id !== userId)
				throw new BadRequestException('You are not assigned to this order')

			if (newStatus === OrderStatus.DELIVERED) {
				if (order.status !== OrderStatus.COMPLETE)
					throw new BadRequestException(
						'Order must be COMPLETE before delivering',
					)
				return this.orderRepo.updateStatus(orderId, newStatus, companyId)
			}

			if (newStatus === OrderStatus.FINISHED) {
				if (order.status !== OrderStatus.DELIVERED)
					throw new BadRequestException(
						'Order must be DELIVERED before finishing',
					)
				if (!order.table?.id)
					throw new BadRequestException('Order is not assigned to a table')
				await this.tableService.updateTable(
					order.table.id,
					{ active: true },
					companyId,
				)

				return this.orderRepo.updateStatus(orderId, newStatus, companyId)
			}

			throw new BadRequestException(
				'Waiter can only set status to DELIVERED or FINISHED',
			)
		}
		throw new BadRequestException('Invalid role for updating order status')
	}

	async getOrderAnalytics(
		query: OrderAnalyticsQueryDto,
	): Promise<IOrderAnalyticsResult[]> {
		const { groupBy, metric = OrderMetric.REVENUE, from, to } = query
		const filters = this.buildFilters(query)
		const orders = await this.orderRepo.findOrdersWithItems(filters)
		const grouped = this.groupOrders(orders, groupBy)

		const getDateRange = (start: string, end: string): string[] => {
			const dates: string[] = []
			const currentDate = new Date(start)
			const endDate = new Date(end)
			while (currentDate <= endDate) {
				const dateStr = currentDate.toISOString().split('T')[0]
				if (dateStr) dates.push(dateStr)
				currentDate.setDate(currentDate.getDate() + 1)
			}
			return dates
		}

		const totalRevenue = orders.reduce((acc, order) => {
			return (
				acc +
				order.orderItems.reduce(
					(sum, item) => sum + item.quantity * item.price,
					0,
				)
			)
		}, 0)

		return Object.entries(grouped).map(([key, group]) => {
			let quantity = 0
			let revenue = 0
			const count = group.length

			for (const order of group) {
				for (const item of order.orderItems) {
					quantity += item.quantity
					revenue += item.quantity * item.price
				}
			}

			const trendMap: Record<string, number> = {}
			for (const order of group) {
				const createdAt = new Date(order.createdAt)
				const dateKey = createdAt.toISOString().split('T')[0]
				if (!dateKey) continue
				trendMap[dateKey] ??= 0

				for (const item of order.orderItems) {
					if (metric === OrderMetric.REVENUE)
						trendMap[dateKey] += item.quantity * item.price
					else if (metric === OrderMetric.QUANTITY)
						trendMap[dateKey] += item.quantity
					else trendMap[dateKey] += 1
				}
			}

			let trend: Array<{ date: string; value: number }> = []
			if (from && to) {
				const dateRange = getDateRange(from, to)
				trend = dateRange.map((date) => ({ date, value: trendMap[date] ?? 0 }))
			} else {
				trend = Object.entries(trendMap).map(([date, value]) => ({
					date,
					value,
				}))
			}

			const values = trend.map((t) => t.value)
			const maxRevenueInDay = values.length > 0 ? Math.max(...values) : 0
			const minRevenueInDay = values.length > 0 ? Math.min(...values) : 0
			const peakDay =
				trend.find((t) => t.value === maxRevenueInDay)?.date ?? null
			const troughDay =
				trend.find((t) => t.value === minRevenueInDay)?.date ?? null

			const value =
				metric === OrderMetric.REVENUE
					? revenue
					: metric === OrderMetric.QUANTITY
						? quantity
						: count

			const groupInfo = this.extractGroupInfo(group, groupBy)

			return {
				group: key,
				groupInfo,
				value,
				count,
				quantity,
				revenue,
				avgRevenuePerOrder: count > 0 ? revenue / count : 0,
				avgItemsPerOrder: count > 0 ? quantity / count : 0,
				percentageOfTotalRevenue:
					totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0,
				maxRevenueInDay,
				minRevenueInDay,
				peakDay,
				troughDay,
				trend,
			}
		})
	}
}
