import { useAuthStore } from '@/store/auth.store'
import { useEffect } from 'react'

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

	useEffect(() => {
		if (hydrated && isAuth && (!isTokenValid() || !userRole)) updateUserRoleFromToken()
	}, [hydrated, isAuth, userRole, isTokenValid, updateUserRoleFromToken])

	return {
		user,
		userRole,
		isAuth,
		loading: !hydrated,
		hasRole,
	}
}
