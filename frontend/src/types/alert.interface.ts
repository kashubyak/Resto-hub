export type AlertSeverity = 'success' | 'error' | 'info' | 'warning'

export interface IAlertData {
	severity: AlertSeverity
	text: string
	duration?: number
	/** Time in seconds until rate limit resets (for 429 errors) */
	retryAfter?: number
}
