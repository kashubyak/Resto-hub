'use client'

import { useUserRoutes } from '@/hooks/useUserRoutes'
import { useSidebarStore } from '@/store/sidebar.store'
import { cn } from '@/utils/cn'
import MenuIcon from '@mui/icons-material/Menu'

export const Header = () => {
	const { currentRoute } = useUserRoutes()
	const { setMobileOpen, mobileOpen } = useSidebarStore()

	return (
		<header className='h-[3.685rem] border-b border-border flex items-center justify-between px-4 bg-background md:hidden'>
			<button
				onClick={() => setMobileOpen(true)}
				className={cn(
					'p-2 rounded-lg hover:bg-secondary transition-colors duration-200',
					mobileOpen ? 'opacity-0 pointer-events-none' : 'opacity-100',
				)}
				aria-label='Open menu'
			>
				<MenuIcon />
			</button>
			<span className='font-semibold'> {currentRoute?.name ?? 'Page'}</span>
		</header>
	)
}
