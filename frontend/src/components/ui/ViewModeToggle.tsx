'use client'

import { Grid3x3, List } from 'lucide-react'
import { memo, useCallback } from 'react'

export type ViewMode = 'grid' | 'list'

interface ViewModeToggleProps {
	viewMode: ViewMode
	onViewModeChange: (mode: ViewMode) => void
}

const ViewModeToggleComponent = ({
	viewMode,
	onViewModeChange,
}: ViewModeToggleProps) => {
	const handleGrid = useCallback(
		() => onViewModeChange('grid'),
		[onViewModeChange],
	)
	const handleList = useCallback(
		() => onViewModeChange('list'),
		[onViewModeChange],
	)

	return (
		<div className="flex gap-2 bg-card border-2 border-border rounded-xl p-1">
			<button
				type="button"
				onClick={handleGrid}
				className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
					viewMode === 'grid'
						? 'bg-primary text-white shadow-md'
						: 'text-muted-foreground hover:text-foreground hover:bg-accent'
				}`}
				aria-label="Grid view"
			>
				<Grid3x3 className="w-5 h-5" />
			</button>
			<button
				type="button"
				onClick={handleList}
				className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
					viewMode === 'list'
						? 'bg-primary text-white shadow-md'
						: 'text-muted-foreground hover:text-foreground hover:bg-accent'
				}`}
				aria-label="List view"
			>
				<List className="w-5 h-5" />
			</button>
		</div>
	)
}

export const ViewModeToggle = memo(ViewModeToggleComponent)
