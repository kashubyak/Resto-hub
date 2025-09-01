import { useAuthStore } from '@/store/auth.store'
import { useEffect, useState } from 'react'
import {
	completeNetworkRequest,
	startNetworkRequest,
	useNetworkProgress,
} from './useNetworkProgress'

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
		if (hydrated && isAuth && (!isTokenValid() || !userRole)) {
			updateUserRoleFromToken()
		}
	}, [hydrated, isAuth, userRole, isTokenValid, updateUserRoleFromToken])

	useEffect(() => {
		if (hydrated && !user && !userRole) {
			const fakeRequestId = startNetworkRequest('fetch-user')
			const timer = setTimeout(() => {
				completeNetworkRequest(fakeRequestId)
				setIsInitializing(false)
			}, 800)
			return () => clearTimeout(timer)
		} else {
			setIsInitializing(false)
		}
	}, [hydrated, user, userRole])

	const isLoading =
		!hydrated || (hydrated && isAuth && (!user || !userRole)) || isInitializing

	return {
		user,
		userRole,
		isAuth,
		loading: isLoading,
		totalProgress,
		hasRole,
	}
}
