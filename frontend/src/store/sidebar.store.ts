'use client'

import { create } from 'zustand'

interface ISidebarState {
	mobileOpen: boolean
	collapsed: boolean
	setMobileOpen: (value: boolean) => void
	setCollapsed: (value: boolean) => void
	toggleMobileOpen: () => void
	toggleCollapsed: () => void
}

export const useSidebarStore = create<ISidebarState>((set) => ({
	mobileOpen: false,
	collapsed: false,
	setMobileOpen: (value) => set({ mobileOpen: value }),
	setCollapsed: (value) => set({ collapsed: value }),
	toggleMobileOpen: () => set((state) => ({ mobileOpen: !state.mobileOpen })),
	toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
}))
