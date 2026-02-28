export interface ITable {
	id: number
	number: number
	seats: number
	active: boolean
	createdAt: string
	updatedAt: string
	companyId?: number
}

export interface ICreateTablePayload {
	number: number
	seats: number
}

export interface IUpdateTablePayload {
	number?: number
	seats?: number
	active?: boolean
}

export interface ICreateTableResponse {
	data: ITable
	message?: string
}
