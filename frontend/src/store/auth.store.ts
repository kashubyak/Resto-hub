import type { IUser } from '@/types/login.interface'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface AuthStore {
	user: IUser | null
	isAuth: boolean
	hydrated: boolean
	setUser: (user: IUser | null) => void
	setIsAuth: (isAuth: boolean) => void
	setHydrated: (state: boolean) => void
}

export const useAuthStore = create<AuthStore>()(
	persist(
		set => ({
			user: null,
			isAuth: false,
			hydrated: false,
			setUser: user => set({ user }),
			setIsAuth: isAuth => set({ isAuth }),
			setHydrated: hydrated => set({ hydrated }),
		}),
		{
			name: 'user-storage',
			storage: createJSONStorage(() => localStorage),
			onRehydrateStorage: () => state => {
				state?.setHydrated(true)
			},
		},
	),
)
