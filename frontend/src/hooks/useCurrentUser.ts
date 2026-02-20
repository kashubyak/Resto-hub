import { useAuthStore } from '@/store/auth.store'
import { useEffect, useMemo, useState } from 'react'
import { useNetworkProgress } from './useNetworkProgress'

export function useCurrentUser() {
	const { user, userRole, isAuth, hydrated, hasRole, checkAuthStatus } =
		useAuthStore()

	const [initialized, setInitialized] = useState(false)
	const { totalProgress } = useNetworkProgress()

	useEffect(() => {
		if (hydrated) {
			checkAuthStatus()
			setInitialized(true)
		}
	}, [hydrated, checkAuthStatus])

	return useMemo(
		() => ({
			user,
			userRole,
			isAuth,
			loading: !hydrated || !initialized,
			totalProgress,
			hasRole,
		}),
		[user, userRole, isAuth, hydrated, initialized, totalProgress, hasRole],
	)
}
