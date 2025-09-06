'use client'

import { cn } from '@/utils/cn'
import MenuIcon from '@mui/icons-material/Menu'

interface HeaderProps {
	onOpenSidebar: () => void
	isSidebarOpen: boolean
}

export const Header = ({ onOpenSidebar, isSidebarOpen }: HeaderProps) => {
	return (
		<header className='h-14 border-b border-border flex items-center justify-between px-4 bg-background md:hidden'>
			{!isSidebarOpen && (
				<button
					onClick={onOpenSidebar}
					className={cn(
						'p-2 rounded-lg hover:bg-secondary',
						'transition-colors duration-200',
					)}
					aria-label='Open menu'
				>
					<MenuIcon />
				</button>
			)}
			<span className='font-semibold'>Dashboard</span>
		</header>
	)
}
