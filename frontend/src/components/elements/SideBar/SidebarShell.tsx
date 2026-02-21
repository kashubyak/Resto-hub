'use client'

import { DashboardLayout } from '@/components/container/DashboardLayout'
import { useAuth } from '@/providers/AuthContext'
import { useAuthStore } from '@/store/auth.store'
import { memo } from 'react'
import { SidebarSkeleton } from './skeleton/SidebarSkeleton'

type Props = { children: React.ReactNode }

export const SidebarShell = memo(({ children }: Props) => {
	const { user } = useAuth()
	const hydrated = useAuthStore((state) => state.hydrated)

	const showSkeleton = !hydrated || !user

	if (showSkeleton)
		return (
			<div className="flex h-screen">
				<SidebarSkeleton />
				<div className="flex-1 flex flex-col">
					<div className="h-16 border-b border-border bg-card/95" />
					<main className="flex-1 overflow-y-auto">{children}</main>
				</div>
			</div>
		)

	return <DashboardLayout>{children}</DashboardLayout>
})

SidebarShell.displayName = 'SidebarShell'
