import type { AlertSeverity } from '@/types/alert.interface'

interface IPendingAlert {
	severity: AlertSeverity
	text: string
	duration?: number
}
