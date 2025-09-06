'use client'

import { useUserRoutes } from '@/hooks/useUserRoutes'
import { cn } from '@/utils/cn'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { SidebarHeader } from '../elements/SidebarHeader'

export const Sidebar = () => {
	const pathname = usePathname()
	const [collapsed, setCollapsed] = useState(false)
	const { routes } = useUserRoutes()

	return (
		<aside
			className={cn(
				'h-screen border-r border-border bg-secondary text-secondary-foreground flex flex-col transition-all duration-300',
				collapsed ? 'w-16' : 'w-56',
			)}
		>
			<SidebarHeader collapsed={collapsed} setCollapsed={setCollapsed} />
			<nav className='flex-1 p-2 space-y-1'>
				{routes.map(route => (
					<Link
						key={route.path}
						href={route.path}
						className={cn(
							'flex items-center rounded-lg px-3 py-2 transition-colors hover:bg-secondary hover:text-foreground',
							pathname === route.path ? 'bg-accent text-foreground font-medium' : '',
						)}
					>
						<span className='flex items-center justify-center w-6 h-6'>
							<route.icon />
						</span>
						<span
							className={cn(
								'ml-3 whitespace-nowrap overflow-hidden transition-all duration-300',
								collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto',
							)}
						>
							{route.name}
						</span>
					</Link>
				))}
			</nav>
		</aside>
	)
}
