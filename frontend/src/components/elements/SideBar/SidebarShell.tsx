'use client'

import { Header } from '@/components/container/Header'
import { useAuth } from '@/providers/AuthContext'
import { useAuthStore } from '@/store/auth.store'
import React, { memo } from 'react'
import { Sidebar } from './Sidebar'
import { SidebarSkeleton } from './skeleton/SidebarSkeleton'

type Props = { children: React.ReactNode }

export const SidebarShell = memo(({ children }: Props) => {
	const { user } = useAuth()
	const hydrated = useAuthStore((state) => state.hydrated)

	const showSkeleton = !hydrated || !user

	return (
		<div className="flex h-screen">
			{showSkeleton ? <SidebarSkeleton /> : <Sidebar />}
			<div className="flex-1 flex flex-col">
				<Header />
				<main className="flex-1 overflow-y-auto">{children}</main>
			</div>
		</div>
	)
})

SidebarShell.displayName = 'SidebarShell'
