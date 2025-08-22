import { DEFAULT_DURATION_ALERT } from '@/constants/share.constant'
import type { IAxiosError } from '@/types/error.interface'
import { parseBackendError } from '@/utils/errorHandler'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

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
	pauseAlertTimer: (id: string) => void
	resumeAlertTimer: (id: string) => void
	showSuccess: (text: string | string[], duration?: number) => void
	showError: (text: string | string[], duration?: number) => void
	showWarning: (text: string | string[], duration?: number) => void
	showInfo: (text: string | string[], duration?: number) => void
	showBackendError: (error: IAxiosError, duration?: number) => void
}

const AlertContext = createContext<IAlertContext>({
	alerts: [],
	showAlert: () => {},
	removeAlert: () => {},
	pauseAlertTimer: () => {},
	resumeAlertTimer: () => {},
	showSuccess: () => {},
	showError: () => {},
	showWarning: () => {},
	showInfo: () => {},
	showBackendError: () => {},
})

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
	const [alerts, setAlerts] = useState<IAlert[]>([])
	const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

	const generateId = () => `alert-${Date.now()}-${Math.random()}`

	const clearTimer = (id: string) => {
		const t = timers.current[id]
		if (t) {
			clearTimeout(t)
			delete timers.current[id]
		}
	}

	const startTimer = (id: string, duration: number) => {
		if (duration > 0) {
			clearTimer(id)
			timers.current[id] = setTimeout(() => {
				removeAlert(id)
			}, duration)
		}
	}

	const pauseAlertTimer = (id: string) => {
		clearTimer(id)
	}

	const resumeAlertTimer = (id: string) => {
		const alert = alerts.find(a => a.id === id)
		if (!alert) return
		const duration = alert.duration ?? DEFAULT_DURATION_ALERT
		startTimer(id, duration)
	}

	const showAlert = (alert: Omit<IAlert, 'id'>) => {
		setAlerts(prev => {
			const existing = prev.find(a => a.severity === alert.severity)
			if (existing) {
				const merged: IAlert = {
					...existing,
					text: `${existing.text}\n${alert.text}`.trim(),
				}
				const d = existing.duration ?? alert.duration ?? DEFAULT_DURATION_ALERT
				startTimer(existing.id, d)
				return prev.map(a => (a.id === existing.id ? merged : a))
			}

			const id = generateId()
			const newAlert: IAlert = {
				...alert,
				id,
				duration: alert.duration ?? DEFAULT_DURATION_ALERT,
			}
			startTimer(id, newAlert.duration!)
			return [...prev, newAlert]
		})
	}

	const removeAlert = (id: string) => {
		clearTimer(id)
		setAlerts(prev => prev.filter(a => a.id !== id))
	}

	const showSuccess = (text: string | string[], duration?: number) =>
		showAlert({
			severity: 'success',
			text: Array.isArray(text) ? text.join('\n') : text,
			duration,
		})

	const showError = (text: string | string[], duration?: number) =>
		showAlert({
			severity: 'error',
			text: Array.isArray(text) ? text.join('\n') : text,
			duration,
		})

	const showWarning = (text: string | string[], duration?: number) =>
		showAlert({
			severity: 'warning',
			text: Array.isArray(text) ? text.join('\n') : text,
			duration,
		})

	const showInfo = (text: string | string[], duration?: number) =>
		showAlert({
			severity: 'info',
			text: Array.isArray(text) ? text.join('\n') : text,
			duration,
		})

	const showBackendError = (error: IAxiosError, duration?: number) => {
		const errorMessages = parseBackendError(error)
		showError(errorMessages, duration)
	}
	useEffect(() => {
		return () => {
			Object.keys(timers.current).forEach(clearTimer)
		}
	}, [])

	return (
		<AlertContext.Provider
			value={{
				alerts,
				showAlert,
				removeAlert,
				pauseAlertTimer,
				resumeAlertTimer,
				showSuccess,
				showError,
				showWarning,
				showInfo,
				showBackendError,
			}}
		>
			{children}
		</AlertContext.Provider>
	)
}

export const useAlert = () => useContext(AlertContext)
