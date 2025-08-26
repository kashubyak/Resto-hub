import type { IApiErrorResponse, IAxiosError } from '@/types/error.interface'

export const toAxiosError = (error: unknown): IAxiosError => {
	if (
		typeof error === 'object' &&
		error !== null &&
		'response' in error &&
		'message' in error
	) {
		return error as IAxiosError
	}

	const message =
		error instanceof Error
			? error.message
			: typeof error === 'string'
			? error
			: 'Unknown error'

	const fallbackResponse: IApiErrorResponse = {
		message: message,
		error: 'Unknown Error',
		statusCode: 500,
	}

	return {
		message: message,
		response: {
			data: fallbackResponse,
			status: 500,
			statusText: 'Internal Server Error',
		},
		isAxiosError: false,
	}
}

export const isAxiosError = (error: unknown): error is IAxiosError => {
	return (
		typeof error === 'object' &&
		error !== null &&
		'response' in error &&
		'message' in error &&
		typeof error.message === 'string'
	)
}
