export interface IPaginationParams {
	page?: number
	limit?: number
}

export interface IPaginatedResponse<T> {
	data: T[]
	total: number
	page: number
	limit: number
	totalPages: number
}

export interface IPaginationMeta {
	total: number
	page: number
	limit: number
	totalPages: number
}
