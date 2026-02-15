import type { IApiErrorResponse, IAxiosError } from '@/types/error.interface'

const ERROR_MESSAGES: Record<number, string> = {
	400: 'Bad request',
	401: 'Unauthorized',
	403: 'Forbidden',
	404: 'Not found',
	422: 'Validation error',
	429: 'Too many requests',
	500: 'Internal server error',
	502: 'Bad gateway',
	503: 'Service unavailable',
	504: 'Gateway timeout',
}

export const getRetryAfter = (error: IAxiosError): number | null => {
	if (error.response?.status !== 429) return null

	const headers = error.response.headers
	if (!headers) return null

	const retryAfter =
		headers['retry-after'] || headers['Retry-After'] || headers['x-ratelimit-reset']

	if (!retryAfter) return null

	const seconds = parseInt(String(retryAfter), 10)
	if (!isNaN(seconds) && seconds > 0) return seconds

	const date = new Date(String(retryAfter))
	if (!isNaN(date.getTime())) {
		const diffMs = date.getTime() - Date.now()
		return Math.max(0, Math.ceil(diffMs / 1000))
	}

	return null
}

export const parseBackendError = (error: IAxiosError): string[] => {
	if (!error.response) {
		if (error.code === 'NETWORK_ERROR')
			return ['Network error. Please check your internet connection.']

		if (error.code === 'ECONNABORTED') return ['Request timeout. Please try again.']
		return ['An unexpected error occurred. Please try again.']
	}

	const data = error.response.data as IApiErrorResponse

	if (data?.message) {
		if (Array.isArray(data.message))
			return data.message.filter(msg => typeof msg === 'string')
		if (typeof data.message === 'string') return [data.message]
	}

	const status = error.response.status
	const defaultMessage = ERROR_MESSAGES[status] || 'An unknown error has occurred'
	return [defaultMessage]
}

export const getFirstError = (error: IAxiosError): string => {
	const errors = parseBackendError(error)
	return errors[0] || 'An unknown error has occurred'
}

export const getAllErrorsAsString = (error: IAxiosError): string => {
	const errors = parseBackendError(error)
	return errors.join('\n')
}
