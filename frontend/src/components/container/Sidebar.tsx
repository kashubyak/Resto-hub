'use client'

import { ROUTES } from '@/constants/pages.constant'
import { cn } from '@/utils/cn'
import AudiotrackIcon from '@mui/icons-material/Audiotrack'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const routes = [
	{ path: ROUTES.PRIVATE.ADMIN.ROOT, name: 'Home', icon: <AudiotrackIcon /> },
]

export const Sidebar = () => {
	const pathname = usePathname()
	return (
		<aside className='h-screen w-64 bg-secondary border-r border-border text-secondary-foreground flex flex-col'>
			<nav className='flex-1 p-2 space-y-1'>
				{routes.map(route => (
					<Link
						key={route.path}
						href={route.path}
						className={cn(
							'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-secondary hover:text-foreground',
							pathname === route.path ? 'bg-accent text-foreground font-medium' : '',
						)}
					>
						<span className='flex items-center justify-center w-6 h-6'>{route.icon}</span>
						<span className='truncate'>{route.name}</span>
					</Link>
				))}
			</nav>
		</aside>
	)
}
