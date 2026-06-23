import type { AlertSeverity } from '@/types/alert.interface'

export const OFFLINE_MUTATION_ALERT_MESSAGE =
	'No internet connection. Action saved and will be executed when the network is restored.'

export const OFFLINE_MUTATION_ALERT_SEVERITY: AlertSeverity = 'warning'
