export interface IApiErrorResponse {
	message: string | string[]
	error: string
	statusCode: number
}

export interface IAxiosError {
	response?: {
		data: IApiErrorResponse
		status: number
		statusText: string
	}
	request?: unknown
	message: string
	config?: {
		url?: string
		method?: string
	}
	code?: string
	isAxiosError: boolean
}
