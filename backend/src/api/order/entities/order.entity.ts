export class OrderItemEntity {
	readonly dishId!: number
	readonly quantity!: number
	readonly price!: number
	readonly notes?: string
}

export class OrderEntity {
	readonly waiterId: number
	readonly tableId: number
	readonly items: readonly OrderItemEntity[]
	readonly companyId: number
	constructor(
		waiterId: number,
		tableId: number,
		items: OrderItemEntity[],
		companyId: number,
	) {
		this.waiterId = waiterId
		this.tableId = tableId
		this.items = items
		this.companyId = companyId
	}
}
