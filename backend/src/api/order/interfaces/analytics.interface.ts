import { type IOrderWithItemsForAnalytics } from './order.interface'

export interface ITrendPoint {
	date: string
	value: number
}

export interface IGroupInfo {
	id?: number
	name?: string
	category?: string
	categoryId?: number
}

export interface IOrderAnalyticsResult {
	group: string
	groupInfo: IGroupInfo
	value: number
	count: number
	quantity: number
	revenue: number
	avgRevenuePerOrder: number
	avgItemsPerOrder: number
	percentageOfTotalRevenue: number
	maxRevenueInDay: number
	minRevenueInDay: number
	peakDay: string | null
	troughDay: string | null
	trend: ITrendPoint[]
}

export type IGroupedOrders = Record<string, IOrderWithItemsForAnalytics[]>
