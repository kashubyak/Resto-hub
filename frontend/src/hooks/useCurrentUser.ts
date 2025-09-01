import { useAuthStore } from '@/store/auth.store'
import { useEffect, useState } from 'react'
import { useLoadingProgress } from './useLoadingProgress'

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
	const isLoading = !hydrated || (hydrated && isAuth && (!user || !userRole))

	const loadingProgress = useLoadingProgress({
		isLoading: isInitializing,
		minDuration: 1500,
		steps: 25,
	})

	useEffect(() => {
		if (hydrated && isAuth && (!isTokenValid() || !userRole)) {
			updateUserRoleFromToken()
		}
	}, [hydrated, isAuth, userRole, isTokenValid, updateUserRoleFromToken])

	useEffect(() => {
		if (hydrated) {
			const timer = setTimeout(() => {
				setIsInitializing(false)
			}, 800)

			return () => clearTimeout(timer)
		}
	}, [hydrated, user, userRole])

	return {
		user,
		userRole,
		isAuth,
		loading: isLoading || isInitializing,
		loadingProgress,
		hasRole,
	}
}
