import React from 'react'

export type ViewMode = 'grid' | 'list'

interface IViewModeToggleProps {
	viewMode: ViewMode
	onViewModeChange: (mode: ViewMode) => void
}

const GridViewIcon = () => (
	<svg width={20} height={20} viewBox='0 0 24 24' fill='currentColor'>
		<path d='M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z' />
	</svg>
)

const ListViewIcon = () => (
	<svg width={20} height={20} viewBox='0 0 24 24' fill='currentColor'>
		<path d='M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z' />
	</svg>
)

export const ViewModeToggle: React.FC<IViewModeToggleProps> = ({
	viewMode,
	onViewModeChange,
}) => {
	return (
		<div className='flex rounded-lg border border-border bg-secondary p-1'>
			<button
				onClick={() => onViewModeChange('grid')}
				className={`flex items-center justify-center p-2 rounded-md transition-colors ${
					viewMode === 'grid'
						? 'active-item text-foreground'
						: 'text-muted-foreground hover:bg-secondary hover:text-foreground'
				}`}
				aria-label='Grid view'
			>
				<GridViewIcon />
			</button>
			<button
				onClick={() => onViewModeChange('list')}
				className={`flex items-center justify-center p-2 rounded-md transition-colors ${
					viewMode === 'list'
						? 'active-item text-foreground'
						: 'text-muted-foreground hover:bg-secondary hover:text-foreground'
				}`}
				aria-label='List view'
			>
				<ListViewIcon />
			</button>
		</div>
	)
}
