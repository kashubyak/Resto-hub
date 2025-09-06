'use client'

import { Header } from '@/components/container/Header'
import { Sidebar } from '@/components/container/sideBar/Sidebar'
import React, { useState } from 'react'

type Props = { children: React.ReactNode }

export default function SidebarShell({ children }: Props) {
	const [mobileOpen, setMobileOpen] = useState(false)

	return (
		<div className='flex h-screen'>
			<Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
			<div className='flex-1 flex flex-col'>
				<Header onOpenSidebar={() => setMobileOpen(true)} isSidebarOpen={mobileOpen} />
				<main className='flex-1 overflow-y-auto p-6'>{children}</main>
			</div>
		</div>
	)
}
