import type { IApiErrorResponse, IAxiosError } from '@/types/error.interface'

export const toAxiosError = (error: unknown): IAxiosError => {
	if (isAxiosError(error)) return error
	const message = extractErrorMessage(error)
	const fallbackResponse: IApiErrorResponse = {
		message,
		error: 'Unknown Error',
		statusCode: 500,
	}

	return {
		message,
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
		typeof (error as IAxiosError).message === 'string'
	)
}

const extractErrorMessage = (error: unknown): string => {
	if (error instanceof Error) return error.message
	if (typeof error === 'string') return error

	if (typeof error === 'object' && error !== null && 'message' in error) {
		const msg = (error as { message: unknown }).message
		if (typeof msg === 'string') return msg
	}

	return 'Unknown error'
}
