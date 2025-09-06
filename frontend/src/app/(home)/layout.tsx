import DashboardShell from '@/components/layout/DashboardShell'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Dashboard',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return <DashboardShell>{children}</DashboardShell>
}
