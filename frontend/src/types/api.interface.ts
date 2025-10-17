import type { AxiosResponse } from 'axios'

export interface IApiResponse<T = unknown> {
	data: T
	message?: string
	status: number
	statusText: string
}

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

export type ApiResponse<T> = AxiosResponse<T>
