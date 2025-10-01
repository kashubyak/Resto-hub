import { SidebarShell } from '@/components/SideBar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Dishes',
}

export default function DishesLayout({ children }: { children: React.ReactNode }) {
	return <SidebarShell>{children}</SidebarShell>
}
