import { type IPaginatedResponse } from '../interface/pagination.interface'

export function calculateSkip(page: number, limit: number): number {
	return (page - 1) * limit
}

export function buildPaginatedResponse<T>(
	data: T[],
	total: number,
	page: number,
	limit: number,
): IPaginatedResponse<T> {
	return {
		data,
		total,
		page,
		limit,
		totalPages: Math.ceil(total / limit),
	}
}
