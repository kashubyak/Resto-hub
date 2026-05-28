export interface INewOrderNotificationPayload {
	id: number
	itemsCount: number
	createdAt: string
}

export interface IOrderCompletedNotificationPayload {
	orderId: number
	status: string
	table: number | null
}

export interface IOrderUpdatedNotificationPayload {
	orderId: number
	status: string
}
