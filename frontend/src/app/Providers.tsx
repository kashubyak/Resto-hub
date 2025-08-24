'use client'

import { AlertDisplay } from '@/components/container/AlertContainer'
import { AlertProvider, useAlert } from '@/providers/AlertContext'
import { AuthProvider } from '@/providers/AuthContext'
import { useAlertStore } from '@/store/alert.store'
import { setGlobalAlertFunction } from '@/utils/api'
import { useEffect } from 'react'

const AlertInitializer = () => {
	const { showError, showWarning, showInfo, showSuccess, showBackendError, showAlert } =
		useAlert()

	useEffect(() => {
		setGlobalAlertFunction(
			(severity, text) => {
				if (severity === 'error') showError(text)
				else if (severity === 'warning') showWarning(text)
				else if (severity === 'info') showInfo(text)
				else if (severity === 'success')
					showSuccess(Array.isArray(text) ? text.join(' ') : text)
			},
			error => {
				showBackendError(error)
			},
		)
	}, [showError, showWarning, showInfo, showSuccess, showBackendError])

	useEffect(() => {
		const pending = useAlertStore.getState().consumePendingAlert()
		if (pending) {
			showAlert({
				severity: pending.severity,
				text: pending.text,
				duration: pending.duration,
			})
		}
	}, [showAlert])
	return null
}

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<AlertProvider>
			<AuthProvider>
				<AlertInitializer />
				{children}
				<AlertDisplay />
			</AuthProvider>
		</AlertProvider>
	)
}
