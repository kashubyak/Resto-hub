import { createContext } from 'react'
interface IAlert {
	id: string
	severity: 'success' | 'error' | 'info' | 'warning'
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
