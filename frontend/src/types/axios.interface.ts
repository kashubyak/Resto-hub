import type { AxiosRequestConfig } from 'axios'

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
	_hideGlobalError?: boolean
	_retry?: boolean
	_retryCount?: number
}

export interface IServerSideRequestConfig extends CustomAxiosRequestConfig {
	revalidate?: number | false
	cache?: 'force-cache' | 'no-store' | 'no-cache' | 'default'
	tags?: string[]
}
