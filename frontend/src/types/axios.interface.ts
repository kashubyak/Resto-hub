import type { AxiosRequestConfig } from 'axios'

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
	_hideGlobalError?: boolean
}
