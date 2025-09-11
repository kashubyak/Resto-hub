'use client'

import { create } from 'zustand'

type SidebarState = {
	mobileOpen: boolean
	collapsed: boolean
	setMobileOpen: (value: boolean) => void
	setCollapsed: (value: boolean) => void
}

export const useSidebarStore = create<SidebarState>(set => ({
	mobileOpen: false,
	collapsed: false,
	setMobileOpen: value => set({ mobileOpen: value }),
	setCollapsed: value => set({ collapsed: value }),
}))
