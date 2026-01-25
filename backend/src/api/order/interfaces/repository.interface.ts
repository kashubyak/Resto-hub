import { type Order, type OrderItem, type User } from '@prisma/client'
import {
	type IFindManyArgs,
	type IFindManyResult,
} from 'src/common/interface/repository.interface'
import {
	type IOrderSummary,
	type IOrderWithFullDetails,
	type IOrderWithItemsForAnalytics,
	type IOrderWithRelations,
} from './order.interface'
import {
	type IOrderOrderByInput,
	type IOrderWhereInput,
} from './prisma.interface'

export type IFindOrdersArgs = IFindManyArgs<
	IOrderWhereInput,
	IOrderOrderByInput
>

export type IFindOrdersResult = IFindManyResult<IOrderWithRelations>

export type IOrderWithRelationsResult = IOrderWithRelations | null

export type IOrderWithFullDetailsResult = IOrderWithFullDetails | null

export type IOrderWithItemsForAnalyticsResult = IOrderWithItemsForAnalytics[]

export type IOrderSummaryResult = IOrderSummary[]

export type IOrderBaseResult = Order

export type IOrderWithCookResult = Order & {
	cook: User | null
}

export type IOrderWithWaiterResult = Order & {
	waiter: User
}

export type IOrderWithItemsResult = IOrderBaseResult & {
	orderItems: OrderItem[]
}

export type IFindOrdersOptions = Omit<
	IFindManyArgs<IOrderWhereInput, IOrderOrderByInput>,
	'where'
>
