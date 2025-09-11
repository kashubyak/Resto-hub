'use client'

import { Header } from '@/components/container/Header'
import { useSidebarStore } from '@/store/sidebar.store'
import React from 'react'
import { Sidebar } from './Sidebar'

type Props = { children: React.ReactNode }

export const SidebarShell = ({ children }: Props) => {
	const { setMobileOpen, mobileOpen } = useSidebarStore()

	return (
		<div className='flex h-screen'>
			<Sidebar />
			<div className='flex-1 flex flex-col'>
				<Header onOpenSidebar={() => setMobileOpen(true)} isSidebarOpen={mobileOpen} />
				<main className='flex-1 overflow-y-auto p-6'>{children}</main>
			</div>
		</div>
	)
}
