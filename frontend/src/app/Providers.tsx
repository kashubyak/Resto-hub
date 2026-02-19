'use client'

import { ApiSubdomainInitializer } from '@/components/init/ApiSubdomainInitializer'
import { AlertDisplay } from '@/components/container/AlertContainer'
import { AUTH } from '@/constants/auth.constant'
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
		if (pending) {
			if (pending.text === AUTH.SESSION_EXPIRED_MESSAGE && typeof window !== 'undefined')
				sessionStorage.setItem(AUTH.SESSION_EXPIRED_SHOWN_KEY, '1')
			showAlert({
				severity: pending.severity,
				text: pending.text,
				duration: pending.duration,
				retryAfter: pending.retryAfter,
			})
		}
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
					<ApiSubdomainInitializer />
					<AlertInitializer />
					{children}
					<AlertDisplay />
				</AuthProvider>
			</AlertProvider>
		</QueryClientProvider>
	)
}
