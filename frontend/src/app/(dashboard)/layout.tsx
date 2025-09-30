import { SidebarShell } from '@/components/SideBar'
import type { Metadata } from 'next'
import { memo } from 'react'

export const metadata: Metadata = {
	title: 'Dashboard',
}

function DashboardLayoutComponent({ children }: { children: React.ReactNode }) {
	return <SidebarShell>{children}</SidebarShell>
}

export const DashboardLayout = memo(DashboardLayoutComponent)
