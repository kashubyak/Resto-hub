import { AUTH } from '@/constants/auth.constant'
import { UserRole } from '@/constants/pages.constant'
import type { IUser } from '@/types/user.interface'
import { clearAuth } from '@/utils/auth-helpers'
import Cookies from 'js-cookie'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface IAuthStore {
	user: IUser | null
	isAuth: boolean
	hydrated: boolean
	userRole: UserRole | null

	setUser: (user: IUser | null) => void
	setIsAuth: (isAuth: boolean) => void
	setHydrated: (state: boolean) => void
	setUserRole: (role: UserRole | null) => void
	hasRole: (role: UserRole | UserRole[]) => boolean
	/**
	 * Check if user is authenticated based on the is_authenticated cookie
	 * Note: This cookie is set by the backend alongside the httpOnly access_token
	 */
	checkAuthStatus: () => boolean
	clearAuth: () => void
}

export const useAuthStore = create<IAuthStore>()(
	persist(
		(set, get) => ({
			user: null,
			isAuth: false,
			hydrated: false,
			userRole: null,

			setUser: user => set({ user }),
			setIsAuth: isAuth => set({ isAuth }),
			setHydrated: hydrated => set({ hydrated }),
			setUserRole: role => set({ userRole: role }),

			hasRole: (roleOrRoles: UserRole | UserRole[]) => {
				const { userRole } = get()
				if (!userRole) return false
				if (Array.isArray(roleOrRoles)) return roleOrRoles.includes(userRole)
				return userRole === roleOrRoles
			},

			/**
			 * Check if user is authenticated by reading the is_authenticated cookie.
			 * The actual token validation is handled server-side with httpOnly cookies.
			 */
			checkAuthStatus: () => {
				const isAuthenticated = Cookies.get(AUTH.AUTH_STATUS) === 'true'
				const currentState = get()

				// Update store if cookie state differs from store state
				if (currentState.isAuth !== isAuthenticated) {
					set({ isAuth: isAuthenticated })
					if (!isAuthenticated) {
						set({ user: null, userRole: null })
					}
				}

				return isAuthenticated
			},

			clearAuth: () => clearAuth(),
		}),
		{
			name: 'user-storage',
			storage: createJSONStorage(() => localStorage),
			onRehydrateStorage: () => state => {
				if (!state) return
				state.setHydrated(true)
				// Sync auth status from cookie on hydration
				state.checkAuthStatus()
			},
			partialize: state => ({
				user: state.user,
				isAuth: state.isAuth,
				userRole: state.userRole,
			}),
		},
	),
)
