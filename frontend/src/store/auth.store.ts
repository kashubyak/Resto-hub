import { UserRole } from '@/constants/pages.constant'
import type { IUser } from '@/types/user.interface'
import { clearAuth } from '@/utils/auth-helpers'
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

			checkAuthStatus: () => get().isAuth,

			clearAuth: () => clearAuth(),
		}),
		{
			name: 'user-storage',
			storage: createJSONStorage(() => localStorage),
			onRehydrateStorage: () => state => {
				if (!state) return
				state.setHydrated(true)
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
