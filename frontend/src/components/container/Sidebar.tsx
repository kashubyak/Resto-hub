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
	const [collapsed, setCollapsed] = useState(false)

	return (
		<aside
			className={cn(
				'h-screen border-r border-border bg-secondary text-secondary-foreground flex flex-col transition-all duration-300',
				collapsed ? 'w-16' : 'w-56',
			)}
		>
			<div
				className={cn(
					'flex items-center justify-between border-b border-border',
					collapsed ? 'p-2' : 'p-4',
				)}
			>
				{!collapsed ? (
					<>
						<div className='w-10 h-10 flex items-center justify-center'>
							<Image src='/Resto Hub Logo Sora.png' alt='Logo' width={40} height={40} />
						</div>
						<button
							onClick={() => setCollapsed(true)}
							className='w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary hover:text-foreground'
							aria-label='Collapse sidebar'
						>
							<ChevronLeftIcon fontSize='medium' />
						</button>
					</>
				) : (
					<button
						onClick={() => setCollapsed(false)}
						className='group w-full h-10 flex items-center justify-center rounded-lg hover:bg-secondary hover:text-foreground relative overflow-hidden'
						aria-label='Expand sidebar'
					>
						<span className='relative w-full h-full flex items-center justify-center'>
							<span className='absolute inset-0 flex items-center justify-center transition-opacity duration-200 group-hover:opacity-0'>
								<Image
									src='/Resto Hub Logo Sora.png'
									alt='Logo'
									width={32}
									height={32}
									className='w-8 h-8 object-contain'
								/>
							</span>
							<span className='absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
								<ChevronRightIcon fontSize='medium' />
							</span>
						</span>
					</button>
				)}
			</div>

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
						<span className='flex items-center justify-center w-6 h-6'>{route.icon}</span>
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
