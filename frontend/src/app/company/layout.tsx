import { SidebarShell } from '@/components/elements/SideBar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Company',
}

export default function CompanyLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <SidebarShell>{children}</SidebarShell>
}
