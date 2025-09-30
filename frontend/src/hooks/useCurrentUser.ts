import { useAuthStore } from '@/store/auth.store'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNetworkProgress } from './useNetworkProgress'

export function useCurrentUser() {
	const {
		user,
		userRole,
		isAuth,
		hydrated,
		hasRole,
		updateUserRoleFromToken,
		isTokenValid,
	} = useAuthStore()

	const [initialized, setInitialized] = useState(false)
	const { totalProgress } = useNetworkProgress()

	const initialize = useCallback(async () => {
		if (isAuth && (!isTokenValid() || !userRole)) await updateUserRoleFromToken()
		setInitialized(true)
	}, [isAuth, userRole, isTokenValid, updateUserRoleFromToken])

	useEffect(() => {
		if (hydrated) initialize()
	}, [hydrated, initialize])

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
