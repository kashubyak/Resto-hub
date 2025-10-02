'use client'

import { useSidebarStore } from '@/store/sidebar.store'
import { cn } from '@/utils/cn'
import CloseIcon from '@mui/icons-material/Close'
import { memo, useCallback } from 'react'
import { ViewableImage } from '../ImageViewer/ViewableImage'
import { SidebarHeader } from './SidebarHeader'
import { SidebarNav } from './SidebarNav'
import { SideBarUser } from './SideBarUser'

interface ISidebarContentProps {
	mode: 'desktop' | 'mobile'
	collapsed: boolean
}

const MobileHeader = memo(({ onClose }: { onClose: () => void }) => (
	<div className='flex items-center justify-between border-b border-border p-2'>
		<div className='w-10 h-10 flex items-center justify-center'>
			<ViewableImage src='/Resto-Hub.png' alt='Logo' width={40} height={40} />
		</div>
		<button
			onClick={onClose}
			className={cn(
				'p-2 rounded-lg hover:bg-secondary',
				'transition-colors duration-200',
			)}
			aria-label='Close menu'
		>
			<CloseIcon />
		</button>
	</div>
))
MobileHeader.displayName = 'MobileHeader'

export const SidebarContent = memo(({ mode, collapsed }: ISidebarContentProps) => {
	const setMobileOpen = useSidebarStore(state => state.setMobileOpen)
	const handleMobileClose = useCallback(() => setMobileOpen(false), [setMobileOpen])

	return (
		<div className='flex flex-col h-full justify-between'>
			<div>
				{mode === 'desktop' ? (
					<SidebarHeader />
				) : (
					<MobileHeader onClose={handleMobileClose} />
				)}

				<SidebarNav collapsed={collapsed} />
			</div>
			<SideBarUser collapsed={collapsed} />
		</div>
	)
})

SidebarContent.displayName = 'SidebarContent'
