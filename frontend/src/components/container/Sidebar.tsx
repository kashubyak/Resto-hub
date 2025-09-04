'use client'

import { ROUTES } from '@/constants/pages.constant'
import { cn } from '@/utils/cn'
import AudiotrackIcon from '@mui/icons-material/Audiotrack'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const routes = [
	{ path: ROUTES.PRIVATE.ADMIN.ROOT, name: 'Home', icon: <AudiotrackIcon /> },
]

export const Sidebar = () => {
	const pathname = usePathname()
	const [collapsed, isCollapsed] = useState(false)
	return (
		<aside
			className={cn(
				'h-screen border-r border-border bg-secondary text-secondary-foreground flex flex-col transition-all duration-300',
				collapsed ? 'w-16' : 'w-56',
			)}
		>
			<div className='flex items-center justify-between p-4 border-b border-border'>
				{!collapsed && (
					<Image src='/Resto Hub Logo Sora.png' alt='Logo' width={40} height={40} />
				)}
				<button
					onClick={() => isCollapsed(!collapsed)}
					className='p-2 rounded-lg hover:bg-secondary-foreground/10'
				>
					{collapsed ? (
						<ChevronRightIcon fontSize='medium' />
					) : (
						<ChevronLeftIcon fontSize='medium' />
					)}
				</button>
			</div>
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
