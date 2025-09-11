'use client'

import { create } from 'zustand'

type SidebarState = {
	mobileOpen: boolean
	collapsed: boolean
	setMobileOpen: (value: boolean) => void
	toggleMobile: () => void
	setCollapsed: (value: boolean) => void
	toggleCollapsed: () => void
}

export const useSidebarStore = create<SidebarState>(set => ({
	mobileOpen: false,
	collapsed: false,
	setMobileOpen: value => set({ mobileOpen: value }),
	toggleMobile: () => set(state => ({ mobileOpen: !state.mobileOpen })),
	setCollapsed: value => set({ collapsed: value }),
	toggleCollapsed: () => set(state => ({ collapsed: !state.collapsed })),
}))
