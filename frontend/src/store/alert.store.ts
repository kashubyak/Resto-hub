import type { AlertSeverity } from '@/types/alert.interface'
import { create } from 'zustand'

interface IPendingAlert {
	severity: AlertSeverity
	text: string
	duration?: number
	retryAfter?: number
}

interface IAlertStore {
	setPendingAlert: (alert: IPendingAlert) => void
	consumePendingAlert: () => IPendingAlert | null
}
const isBrowser = typeof window !== 'undefined'
export const useAlertStore = create<IAlertStore>(() => ({
	setPendingAlert: (alert: IPendingAlert) => {
		if (!isBrowser) return
		try {
			localStorage.setItem('pending-alert', JSON.stringify(alert))
		} catch {
			//
		}
	},

	consumePendingAlert: () => {
		if (!isBrowser) return null

		try {
			const stored = localStorage.getItem('pending-alert')
			if (!stored) return null
			localStorage.removeItem('pending-alert')
			return JSON.parse(stored) as IPendingAlert
		} catch {
			localStorage.removeItem('pending-alert')
			return null
		}
	},
}))
