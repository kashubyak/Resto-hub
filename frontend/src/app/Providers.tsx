'use client'

import { AlertDisplay } from '@/components/container/AlertContainer'
import { ApiSubdomainInitializer } from '@/components/init/ApiSubdomainInitializer'
import { PWAInstallPrompt } from '@/components/pwa/PWAInstallPrompt'
import { AUTH } from '@/constants/auth.constant'
import {
	OFFLINE_MUTATION_ALERT_MESSAGE,
	OFFLINE_MUTATION_ALERT_SEVERITY,
} from '@/constants/offline.constant'
import { AlertProvider, useAlert } from '@/providers/AlertContext'
import { AuthProvider } from '@/providers/AuthContext'
import { SocketProvider } from '@/providers/SocketProvider'
import { ThemeProvider } from '@/providers/ThemeContext'
import { useAlertStore } from '@/store/alert.store'
import { setGlobalAlertFunction } from '@/utils/api'
import { queryPersister } from '@/utils/query-persister'
import { registerMutationDefaults } from '@/utils/registerMutationDefaults'
import { MutationCache, QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { useEffect, useRef } from 'react'
import { AppSerwistProvider } from './serwist-provider'

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
			if (
				pending.text === AUTH.SESSION_EXPIRED_MESSAGE &&
				typeof window !== 'undefined'
			)
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

	queryClientRef.current ??= (() => {
		const client = new QueryClient({
			mutationCache: new MutationCache({
				onMutate: () => {
					if (typeof navigator !== 'undefined' && !navigator.onLine)
						useAlertStore.getState().showAlert({
							severity: OFFLINE_MUTATION_ALERT_SEVERITY,
							text: OFFLINE_MUTATION_ALERT_MESSAGE,
						})
				},
			}),
			defaultOptions: {
				queries: {
					staleTime: 60_000,
					gcTime: 10 * 60_000,
					refetchOnWindowFocus: false,
					refetchOnMount: true,
					refetchOnReconnect: true,
					retry: 1,
				},
				mutations: {
					networkMode: 'offlineFirst',
				},
			},
		})
		registerMutationDefaults(client)
		return client
	})()

	return (
		<AppSerwistProvider>
			<PersistQueryClientProvider
				client={queryClientRef.current}
				persistOptions={{
					persister: queryPersister,
					maxAge: 24 * 60 * 60 * 1000,
					dehydrateOptions: {
						shouldDehydrateMutation: (mutation) => mutation.state.isPaused,
					},
				}}
				onSuccess={() => {
					void queryClientRef.current?.resumePausedMutations().then(() => {
						void queryClientRef.current?.invalidateQueries()
					})
				}}
			>
				<ThemeProvider>
					<AlertProvider>
						<AuthProvider>
							<SocketProvider>
								<ApiSubdomainInitializer />
								<AlertInitializer />
								{children}
								<AlertDisplay />
								<PWAInstallPrompt />
							</SocketProvider>
						</AuthProvider>
					</AlertProvider>
				</ThemeProvider>
			</PersistQueryClientProvider>
		</AppSerwistProvider>
	)
}
