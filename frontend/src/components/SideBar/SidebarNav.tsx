import { cn } from '@/utils/cn'
import Link from 'next/link'

interface ISidebarNavProps {
	collapsed: boolean
	routes: { name: string; path: string; icon: React.ElementType }[]
	pathname: string
}

export const SidebarNav = ({ collapsed, routes, pathname }: ISidebarNavProps) => {
	return (
		<nav className='flex-1 p-2 space-y-1'>
			{routes.map(route => (
				<Link
					key={route.path}
					href={route.path}
					className={cn(
						'flex items-center rounded-lg px-3 py-2 transition-colors',
						pathname === route.path
							? 'active-item text-foreground font-medium'
							: 'text-muted-foreground hover:bg-secondary hover:text-foreground',
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
	)
}
