'use client'

import { AlertDisplay } from '@/components/container/AlertContainer'
import { AlertProvider, useAlert } from '@/providers/AlertContext'
import { AuthProvider } from '@/providers/AuthContext'
import { useAlertStore } from '@/store/alert.store'
import { setGlobalAlertFunction } from '@/utils/api'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

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
		if (pending)
			showAlert({
				severity: pending.severity,
				text: pending.text,
				duration: pending.duration,
				retryAfter: pending.retryAfter,
			})
	}, [showAlert])

	return null
}

export function Providers({ children }: { children: React.ReactNode }) {
	const queryClientRef = useRef<QueryClient>(null)
	if (!queryClientRef.current) queryClientRef.current = new QueryClient()

	return (
		<QueryClientProvider client={queryClientRef.current}>
			<AlertProvider>
				<AuthProvider>
					<AlertInitializer />
					{children}
					<AlertDisplay />
				</AuthProvider>
			</AlertProvider>
		</QueryClientProvider>
	)
}
