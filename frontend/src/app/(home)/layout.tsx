import SidebarShell from '@/components/layout/SidebarShell'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Dashboard',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return <SidebarShell>{children}</SidebarShell>
}
