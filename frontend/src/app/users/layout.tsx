import { SidebarShell } from '@/components/elements/SideBar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Users',
}

export default function UsersLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <SidebarShell>{children}</SidebarShell>
}
