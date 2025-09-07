'use client'

import { useUserRoutes } from '@/hooks/useUserRoutes'
import { cn } from '@/utils/cn'
import CloseIcon from '@mui/icons-material/Close'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { SidebarHeader } from './SidebarHeader'
import { SidebarNav } from './SIdebarNav'

interface SidebarProps {
	mobileOpen: boolean
	setMobileOpen: (value: boolean) => void
}

export const Sidebar = ({ mobileOpen, setMobileOpen }: SidebarProps) => {
	const pathname = usePathname()
	const [collapsed, setCollapsed] = useState(false)
	const { routes } = useUserRoutes()

	return (
		<>
			<aside
				className={cn(
					'h-screen border-r border-border text-secondary-foreground flex-col transition-all duration-300 hidden md:flex',
					collapsed ? 'w-16 bg-background' : 'w-56 bg-secondary',
				)}
			>
				<SidebarHeader collapsed={collapsed} setCollapsed={setCollapsed} />
				<SidebarNav collapsed={collapsed} routes={routes} pathname={pathname} />
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
					<div className='flex items-center justify-between border-b border-border p-2'>
						<div className='w-10 h-10 flex items-center justify-center'>
							<Image src='/Resto Hub Logo Sora.png' alt='Logo' width={40} height={40} />
						</div>
						<button
							onClick={() => setMobileOpen(false)}
							className={cn(
								'p-2 rounded-lg hover:bg-secondary',
								'transition-colors duration-200',
							)}
							aria-label='Open menu'
						>
							<CloseIcon />
						</button>
					</div>
					<SidebarNav
						collapsed={collapsed && !mobileOpen}
						routes={routes}
						pathname={pathname}
					/>
				</aside>
			</div>
		</>
	)
}
