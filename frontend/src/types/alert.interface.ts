export type AlertSeverity = 'success' | 'error' | 'info' | 'warning'

export interface IAlertData {
	severity: AlertSeverity
	text: string
	duration?: number
	retryAfter?: number
}
