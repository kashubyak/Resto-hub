'use client'

import { useUserRoutes } from '@/hooks/useUserRoutes'
import { cn } from '@/utils/cn'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { memo, useMemo } from 'react'

interface ISidebarNavProps {
	collapsed: boolean
}

const NavItem = memo(
	({
		route,
		isActive,
		collapsed,
	}: {
		route: { path: string; name: string; icon: React.ComponentType }
		isActive: boolean
		collapsed: boolean
	}) => {
		const Icon = route.icon

		return (
			<Link
				href={route.path}
				className={cn(
					'flex items-center rounded-lg px-3 py-2 transition-colors',
					isActive
						? 'active-item text-foreground font-medium'
						: 'text-muted-foreground hover:bg-secondary hover:text-foreground',
				)}
			>
				<span className='flex items-center justify-center w-6 h-6'>
					<Icon />
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
		)
	},
)
NavItem.displayName = 'NavItem'

export const SidebarNav = memo(({ collapsed }: ISidebarNavProps) => {
	const { routes } = useUserRoutes()
	const pathname = usePathname()

	const routesWithActiveState = useMemo(
		() =>
			routes.map(route => ({
				...route,
				isActive: pathname === route.path,
			})),
		[routes, pathname],
	)

	return (
		<nav className='flex-1 p-2 space-y-1'>
			{routesWithActiveState.map(route => (
				<NavItem
					key={route.path}
					route={route}
					isActive={route.isActive}
					collapsed={collapsed}
				/>
			))}
		</nav>
	)
})

SidebarNav.displayName = 'SidebarNav'
