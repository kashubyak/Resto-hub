import { DEFAULT_DURATION_ALERT } from '@/constants/alert.constant'
import type { AlertSeverity } from '@/types/alert.interface'
import type { IAxiosError } from '@/types/error.interface'
import { parseBackendError } from '@/utils/errorHandler'
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'

interface IAlert {
	id: string
	severity: AlertSeverity
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

	const clearTimer = useCallback((id: string) => {
		const t = timers.current[id]
		if (t) {
			clearTimeout(t)
			delete timers.current[id]
		}
	}, [])

	const removeAlert = useCallback(
		(id: string) => {
			clearTimer(id)
			setAlerts(prev => prev.filter(a => a.id !== id))
		},
		[clearTimer],
	)

	const startTimer = useCallback(
		(id: string, duration: number) => {
			if (duration > 0) {
				clearTimer(id)
				timers.current[id] = setTimeout(() => {
					removeAlert(id)
				}, duration)
			}
		},
		[clearTimer, removeAlert],
	)

	const pauseAlertTimer = (id: string) => {
		clearTimer(id)
	}

	const resumeAlertTimer = (id: string) => {
		const alert = alerts.find(a => a.id === id)
		if (!alert) return
		const duration = alert.duration ?? DEFAULT_DURATION_ALERT
		startTimer(id, duration)
	}

	const showAlert = useCallback(
		(alert: Omit<IAlert, 'id'>) => {
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
		},
		[startTimer],
	)

	const showSuccess = (text: string | string[], duration?: number) =>
		showAlert({
			severity: 'success',
			text: Array.isArray(text) ? text.join('\n') : text,
			duration,
		})

	const showError = useCallback(
		(text: string | string[], duration?: number) =>
			showAlert({
				severity: 'error',
				text: Array.isArray(text) ? text.join('\n') : text,
				duration,
			}),
		[showAlert],
	)

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

	const showBackendError = useCallback(
		(error: IAxiosError, duration?: number) => {
			const errorMessages = parseBackendError(error)
			showError(errorMessages, duration)
		},
		[showError],
	)

	useEffect(() => {
		const timersSnapshot = { ...timers.current }
		return () => {
			Object.keys(timersSnapshot).forEach(clearTimer)
		}
	}, [clearTimer])

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
