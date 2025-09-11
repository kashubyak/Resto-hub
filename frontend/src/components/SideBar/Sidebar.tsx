'use client'

import { useSidebarStore } from '@/store/sidebar.store'
import { cn } from '@/utils/cn'
import { usePathname } from 'next/navigation'
import { SidebarContent } from './SidebarContent'

export const Sidebar = () => {
	const pathname = usePathname()
	const { mobileOpen, setMobileOpen, collapsed, setCollapsed } = useSidebarStore()

	return (
		<>
			<aside
				className={cn(
					'h-screen border-r border-border text-secondary-foreground flex-col transition-all duration-300 hidden md:flex',
					collapsed ? 'w-16 bg-background' : 'w-56 bg-secondary',
				)}
			>
				<SidebarContent
					mode='desktop'
					collapsed={collapsed}
					setCollapsed={setCollapsed}
					pathname={pathname}
					onClose={() => setMobileOpen(false)}
				/>
			</aside>

			<div
				className={cn(
					'fixed inset-0 z-40 md:hidden transition-opacity duration-300',
					mobileOpen
						? 'opacity-100 pointer-events-auto'
						: 'opacity-0 pointer-events-none',
				)}
			>
				<div
					className='absolute inset-0 bg-background opacity-50'
					onClick={() => setMobileOpen(false)}
				/>
				<aside
					className={cn(
						'absolute left-0 top-0 h-full w-56 bg-secondary border-r border-border flex flex-col transition-transform duration-300',
						mobileOpen ? 'translate-x-0' : '-translate-x-full',
					)}
				>
					<SidebarContent
						mode='mobile'
						collapsed={collapsed && !mobileOpen}
						setCollapsed={setCollapsed}
						pathname={pathname}
						onClose={() => setMobileOpen(false)}
					/>
				</aside>
			</div>
		</>
	)
}
