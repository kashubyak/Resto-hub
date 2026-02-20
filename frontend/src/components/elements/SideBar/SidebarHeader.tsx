'use client'

import { useSidebarStore } from '@/store/sidebar.store'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { memo, useCallback } from 'react'
import { ViewableImage } from '../ImageViewer/ViewableImage'

const ExpandedHeader = memo(({ onCollapse }: { onCollapse: () => void }) => (
	<>
		<div className="w-10 h-10 flex items-center justify-center">
			<ViewableImage
				src="/Resto-Hub.png"
				alt="Logo"
				width={40}
				height={40}
				className="object-contain rounded-md"
			/>
		</div>
		<button
			onClick={onCollapse}
			className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary hover:text-foreground"
			aria-label="Collapse sidebar"
		>
			<ChevronLeftIcon fontSize="medium" />
		</button>
	</>
))
ExpandedHeader.displayName = 'ExpandedHeader'

const CollapsedHeader = memo(({ onExpand }: { onExpand: () => void }) => (
	<button
		onClick={onExpand}
		className="group w-12 h-10 flex items-center justify-center rounded-lg hover:bg-secondary hover:text-foreground relative overflow-hidden"
		aria-label="Expand sidebar"
	>
		<span className="relative w-10 h-10 flex items-center justify-center">
			<span className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 group-hover:opacity-0">
				<ViewableImage
					src="/Resto-Hub.png"
					alt="Logo"
					width={40}
					height={40}
					className="object-contain rounded-md"
				/>
			</span>
			<span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
				<ChevronRightIcon fontSize="medium" />
			</span>
		</span>
	</button>
))
CollapsedHeader.displayName = 'CollapsedHeader'

export const SidebarHeader = memo(() => {
	const collapsed = useSidebarStore((state) => state.collapsed)
	const setCollapsed = useSidebarStore((state) => state.setCollapsed)

	const handleCollapse = useCallback(() => setCollapsed(true), [setCollapsed])
	const handleExpand = useCallback(() => setCollapsed(false), [setCollapsed])

	return (
		<div className="flex items-center justify-between border-b border-border p-2">
			{!collapsed ? (
				<ExpandedHeader onCollapse={handleCollapse} />
			) : (
				<CollapsedHeader onExpand={handleExpand} />
			)}
		</div>
	)
})

SidebarHeader.displayName = 'SidebarHeader'
