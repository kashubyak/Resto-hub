'use client'

import { AlertDisplay } from '@/components/container/AlertContainer'
import { AlertProvider, useAlert } from '@/providers/AlertContext'
import { AuthProvider } from '@/providers/AuthContext'
import { useAlertStore } from '@/store/alert.store'
import { setGlobalAlertFunction } from '@/utils/api'
import { useEffect } from 'react'

const AlertInitializer = () => {
	const { showAlert } = useAlert()

	useEffect(() => {
		setGlobalAlertFunction((severity, text) =>
			showAlert({
				severity,
				text: Array.isArray(text) ? text.join('\n') : text,
			}),
		)
	}, [showAlert])

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
