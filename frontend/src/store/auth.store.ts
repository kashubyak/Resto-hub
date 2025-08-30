// frontend/src/store/auth.store.ts
import { AUTH } from '@/constants/auth.constant'
import { UserRole } from '@/constants/pages.constant'
import { decodeJWT } from '@/lib/middleware/jwt-decoder'
import type { IUser } from '@/types/login.interface'
import Cookies from 'js-cookie'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface IAuthStore {
	user: IUser | null
	isAuth: boolean
	hydrated: boolean
	userRole: UserRole | null
	tokenValidUntil: number | null
	setUser: (user: IUser | null) => void
	setIsAuth: (isAuth: boolean) => void
	setHydrated: (state: boolean) => void
	setUserRole: (role: UserRole | null) => void
	setTokenValidUntil: (timestamp: number | null) => void
	updateUserRoleFromToken: () => boolean
	hasRole: (role: UserRole | UserRole[]) => boolean
	isTokenValid: () => boolean
	clearAuth: () => void
}

export const useAuthStore = create<IAuthStore>()(
	persist(
		(set, get) => ({
			user: null,
			isAuth: false,
			hydrated: false,
			userRole: null,
			tokenValidUntil: null,

			setUser: user => set({ user }),
			setIsAuth: isAuth => set({ isAuth }),
			setHydrated: hydrated => set({ hydrated }),
			setUserRole: role => set({ userRole: role }),
			setTokenValidUntil: timestamp => set({ tokenValidUntil: timestamp }),

			updateUserRoleFromToken: () => {
				const token = Cookies.get(AUTH.TOKEN)
				if (!token) {
					set({ userRole: null, tokenValidUntil: null })
					return false
				}

				const decodedToken = decodeJWT(token)
				if (!decodedToken) {
					set({ userRole: null, tokenValidUntil: null })
					return false
				}
				const tokenValidUntil = decodedToken.exp * 1000
				const currentState = get()

				if (
					currentState.userRole !== decodedToken.role ||
					currentState.tokenValidUntil !== tokenValidUntil
				) {
					set({
						userRole: decodedToken.role,
						tokenValidUntil: tokenValidUntil,
					})
				}

				return true
			},

			hasRole: (roleOrRoles: UserRole | UserRole[]) => {
				const { userRole } = get()
				if (!userRole) return false
				if (Array.isArray(roleOrRoles)) return roleOrRoles.includes(userRole)
				return userRole === roleOrRoles
			},

			isTokenValid: () => {
				const { tokenValidUntil } = get()
				if (!tokenValidUntil) return false
				return Date.now() < tokenValidUntil
			},

			clearAuth: () => {
				set({
					user: null,
					isAuth: false,
					userRole: null,
					tokenValidUntil: null,
				})
			},
		}),
		{
			name: 'user-storage',
			storage: createJSONStorage(() => localStorage),
			onRehydrateStorage: () => state => {
				state?.setHydrated(true)
				if (state && state.isAuth) {
					const needsUpdate = !state.isTokenValid() || !state.userRole
					if (needsUpdate) state.updateUserRoleFromToken()
				}
			},
		},
	),
)
