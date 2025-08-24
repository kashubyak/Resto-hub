import type { AlertSeverity } from '@/types/alert.interface'
import { create } from 'zustand'

interface IPendingAlert {
	severity: AlertSeverity
	text: string
	duration?: number
}

interface IAlertStore {
	setPendingAlert: (alert: IPendingAlert) => void
	consumePendingAlert: () => IPendingAlert | null
}
export const useAlertStore = create<IAlertStore>(set => ({
	setPendingAlert: alert => {
		localStorage.setItem('pending-alert', JSON.stringify(alert))
	},
	consumePendingAlert: () => {
		const stored = localStorage.getItem('pending-alert')
		if (!stored) return null
		localStorage.removeItem('pending-alert')
		try {
			return JSON.parse(stored) as IPendingAlert
		} catch {
			return null
		}
	},
}))
