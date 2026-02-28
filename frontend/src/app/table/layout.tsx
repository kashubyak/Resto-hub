import { SidebarShell } from '@/components/elements/SideBar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Tables',
}

export default function TablesLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <SidebarShell>{children}</SidebarShell>
}
