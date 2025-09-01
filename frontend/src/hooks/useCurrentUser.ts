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

	const [isInitializing, setIsInitializing] = useState(true)
	const { totalProgress } = useNetworkProgress()

	useEffect(() => {
		if (!hydrated) return

		const run = async () => {
			if (isAuth && (!isTokenValid() || !userRole)) {
				await Promise.resolve(updateUserRoleFromToken())
			}
			setIsInitializing(false)
		}

		run()
	}, [hydrated, isAuth, userRole, isTokenValid, updateUserRoleFromToken])

	return {
		user,
		userRole,
		isAuth,
		loading: !hydrated || isInitializing,
		totalProgress,
		hasRole,
	}
}
