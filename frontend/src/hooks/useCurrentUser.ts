import { useAuthStore } from '@/store/auth.store'
import { useEffect } from 'react'

export const useCurrentUser = () => {
	const { user, userRole, isAuth, hydrated, hasRole, updateUserFromToken, isTokenValid } =
		useAuthStore()

	useEffect(() => {
		if (hydrated && (!isTokenValid() || !userRole)) updateUserFromToken()
	}, [hydrated, userRole, isTokenValid, updateUserFromToken])

	return {
		user,
		userRole,
		isAuth,
		loading: !hydrated,
		hasRole,
	}
}
