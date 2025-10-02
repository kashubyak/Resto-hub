import { AUTH } from '@/constants/auth.constant'
import { UserRole } from '@/constants/pages.constant'
import { decodeJWT } from '@/lib/middleware/jwt-decoder'
import type { IUser } from '@/types/user.interface'
import { clearAuth } from '@/utils/auth-helpers'
import { convertToDays } from '@/utils/convertToDays'
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
	updateUserRoleFromToken: () => Promise<boolean>
	hasRole: (role: UserRole | UserRole[]) => boolean
	isTokenValid: () => boolean
	clearAuth: () => void
}

const JWT_EXPIRES_IN = process.env.NEXT_PUBLIC_JWT_EXPIRES_IN || '1d'

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

			updateUserRoleFromToken: async () => {
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

				const tokenValidUntil =
					Date.now() + convertToDays(JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000

				const currentState = get()
				const needsUpdate =
					currentState.userRole !== decodedToken.role ||
					currentState.tokenValidUntil !== tokenValidUntil

				if (needsUpdate) {
					set({
						userRole: decodedToken.role,
						tokenValidUntil,
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
				return !!tokenValidUntil && Date.now() < tokenValidUntil
			},

			clearAuth: () => clearAuth(),
		}),
		{
			name: 'user-storage',
			storage: createJSONStorage(() => localStorage),
			onRehydrateStorage: () => state => {
				if (!state) return
				state.setHydrated(true)
				if (state.isAuth) {
					const needsUpdate = !state.isTokenValid() || !state.userRole
					if (needsUpdate) state.updateUserRoleFromToken()
				}
			},
			partialize: state => ({
				user: state.user,
				isAuth: state.isAuth,
				userRole: state.userRole,
				tokenValidUntil: state.tokenValidUntil,
			}),
		},
	),
)
