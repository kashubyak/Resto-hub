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
	showError: (text: string, duration?: number) => void
	showWarning: (text: string, duration?: number) => void
	showInfo: (text: string, duration?: number) => void
}
const AlertContext = createContext<IAlertContext>({
	alerts: [],
	showAlert: () => {},
	removeAlert: () => {},
	showSuccess: () => {},
	showError: () => {},
	showWarning: () => {},
	showInfo: () => {},
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
		showAlert({ severity: 'success', text, duration })
	}
	const showError = (text: string, duration?: number) => {
		showAlert({ severity: 'error', text, duration })
	}
	const showWarning = (text: string, duration?: number) => {
		showAlert({ severity: 'warning', text, duration })
	}
	const showInfo = (text: string, duration?: number) => {
		showAlert({ severity: 'info', text, duration })
	}
	const value = {
		alerts,
		showAlert,
		removeAlert,
		showSuccess,
		showError,
		showWarning,
		showInfo,
	}
	return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
}
export const useAlert = () => useContext(AlertContext)
