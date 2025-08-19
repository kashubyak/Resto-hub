import type { IAxiosError } from '@/types/error.interface'
import { parseBackendError } from '@/utils/errorHandler'
import { createContext, useContext, useState } from 'react'

interface IAlert {
	id: string
	severity: 'success' | 'error' | 'info' | 'warning'
	text: string
	duration?: number
}

interface IAlertContext {
	alerts: IAlert[]
	showAlert: (alert: Omit<IAlert, 'id'>) => void
	removeAlert: (id: string) => void
	showSuccess: (text: string, duration?: number) => void
	showError: (text: string | string[], duration?: number) => void
	showWarning: (text: string | string[], duration?: number) => void
	showInfo: (text: string | string[], duration?: number) => void
	showBackendError: (error: IAxiosError, duration?: number) => void
}

const AlertContext = createContext<IAlertContext>({
	alerts: [],
	showAlert: () => {},
	removeAlert: () => {},
	showSuccess: () => {},
	showError: () => {},
	showWarning: () => {},
	showInfo: () => {},
	showBackendError: () => {},
})

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
	const [alerts, setAlerts] = useState<IAlert[]>([])
	const generateId = () => `alert-${Date.now()}-${Math.random()}`

	const showAlert = (alert: Omit<IAlert, 'id'>) => {
		const id = generateId()
		const newAlert: IAlert = { ...alert, id }
		setAlerts(prev => [...prev, newAlert])
		const duration = alert.duration ?? 5000
		if (duration > 0) {
			setTimeout(() => {
				removeAlert(id)
			}, duration)
		}
	}

	const removeAlert = (id: string) => {
		setAlerts(prev => prev.filter(alert => alert.id !== id))
	}

	const showSuccess = (text: string, duration?: number) => {
		console.log(text)
		showAlert({ severity: 'success', text, duration })
	}

	const showError = (text: string | string[], duration?: number) => {
		if (Array.isArray(text)) {
			text.forEach((message, index) => {
				setTimeout(() => {
					showAlert({ severity: 'error', text: message, duration })
				}, index * 100)
			})
		} else {
			showAlert({ severity: 'error', text, duration })
		}
	}

	const showWarning = (text: string | string[], duration?: number) => {
		if (Array.isArray(text)) {
			text.forEach((message, index) => {
				setTimeout(() => {
					showAlert({ severity: 'warning', text: message, duration })
				}, index * 100)
			})
		} else {
			showAlert({ severity: 'warning', text, duration })
		}
	}

	const showInfo = (text: string | string[], duration?: number) => {
		if (Array.isArray(text)) {
			text.forEach((message, index) => {
				setTimeout(() => {
					showAlert({ severity: 'info', text: message, duration })
				}, index * 100)
			})
		} else {
			showAlert({ severity: 'info', text, duration })
		}
	}

	const showBackendError = (error: IAxiosError, duration?: number) => {
		const errorMessages = parseBackendError(error)
		showError(errorMessages, duration)
	}

	const value = {
		alerts,
		showAlert,
		removeAlert,
		showSuccess,
		showError,
		showWarning,
		showInfo,
		showBackendError,
	}

	return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
}

export const useAlert = () => useContext(AlertContext)
