import { useAuthStore } from '@/store/auth.store'
import { useEffect, useState } from 'react'
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

	useEffect(() => {
		if (!hydrated) return

		const initialize = async () => {
			if (isAuth && (!isTokenValid() || !userRole)) await updateUserRoleFromToken()
			setInitialized(true)
		}

		initialize()
	}, [hydrated, isAuth, userRole, isTokenValid, updateUserRoleFromToken])

	return {
		user,
		userRole,
		isAuth,
		loading: !hydrated || !initialized,
		totalProgress,
		hasRole,
	}
}
