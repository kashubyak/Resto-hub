import type { IApiErrorResponse, IAxiosError } from '@/types/error.interface'

export const parseBackendError = (error: IAxiosError): string[] => {
	if (!error.response) {
		if (error.code === 'NETWORK_ERROR')
			return ['Network error. Please check your internet connection.']
		return ['An unexpected error occurred. Please try again.']
	}

	const data = error.response.data as IApiErrorResponse

	if (data && data.message) {
		if (Array.isArray(data.message)) return data.message
		if (typeof data.message === 'string') return [data.message]
	}

	const status = error.response.status
	switch (status) {
		case 400:
			return ['Bad request']
		case 401:
			return ['Unauthorized']
		case 403:
			return ['Forbidden']
		case 404:
			return ['Not found']
		case 422:
			return ['Validation error']
		case 429:
			return ['Too many requests. Please try again later.']
		case 500:
			return ['Internal server error']
		case 502:
			return ['Bad gateway']
		case 503:
			return ['Service unavailable']
		default:
			return ['An unknown error has occurred']
	}
}
export const getFirstError = (error: IAxiosError): string => {
	const errors = parseBackendError(error)
	return errors[0] || 'An unknown error has occurred'
}

export const getAllErrorsAsString = (error: IAxiosError): string => {
	const errors = parseBackendError(error)
	return errors.join('\n')
}
