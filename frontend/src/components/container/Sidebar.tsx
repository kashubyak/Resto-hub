'use client'

import { ROUTES } from '@/constants/pages.constant'
import { cn } from '@/utils/cn'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const routes = [{ path: ROUTES.PRIVATE.ADMIN.ROOT, name: 'Home' }]

export const Sidebar = () => {
	const pathname = usePathname()
	return (
		<aside className="h-screen w-64 bg-secondary text-secondary-foreground flex flex-col ">
			<nav className="flex-1 p-2 space-y-2">
				{routes.map(route => (
					<Link
						key={route.path}
						href={route.path}
						className={cn(
							'block rounded-lg px-3 py-2 transition-colors',
							pathname === route.path
								? 'active-item text-foreground'
								: 'text-gray-300 hover:bg-gray-800 hover:text-white',
						)}
					>
						{route.name}
					</Link>
				))}
			</nav>
		</aside>
	)
}
