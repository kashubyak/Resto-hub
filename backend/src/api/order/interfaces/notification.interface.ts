export interface INewOrderNotification {
	id: number
	itemsCount: number
	createdAt: Date
}

export interface IOrderCompletedNotification {
	orderId: number
	status: string
	table: number | null
}

export interface IOrderUpdatedNotification {
	orderId: number
	status: string
}

export type INotificationData =
	| INewOrderNotification
	| IOrderCompletedNotification
	| IOrderUpdatedNotification
