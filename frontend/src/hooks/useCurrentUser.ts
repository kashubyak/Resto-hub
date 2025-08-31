import { useAuthStore } from '@/store/auth.store'
import { useEffect, useState } from 'react'

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

	const [loadingProgress, setLoadingProgress] = useState(0)

	useEffect(() => {
		const updateProgress = () => {
			let progress = 0
			if (hydrated) progress += 50
			if (isAuth) progress += 25
			if (user) progress += 15
			if (userRole) progress += 10

			setLoadingProgress(progress)
		}

		updateProgress()
	}, [hydrated, isAuth, user, userRole])

	useEffect(() => {
		if (hydrated && isAuth && (!isTokenValid() || !userRole)) {
			updateUserRoleFromToken()
		}
	}, [hydrated, isAuth, userRole, isTokenValid, updateUserRoleFromToken])

	return {
		user,
		userRole,
		isAuth,
		loading: !hydrated,
		loadingProgress,
		hasRole,
	}
}
