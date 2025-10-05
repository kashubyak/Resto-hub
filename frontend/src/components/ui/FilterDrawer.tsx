'use client'

import CloseIcon from '@mui/icons-material/Close'
import FilterListIcon from '@mui/icons-material/FilterList'
import { Drawer, IconButton } from '@mui/material'
import { useState } from 'react'

interface FilterDrawerProps {
	onFilterChange?: (filters: FilterValues) => void
}

export interface FilterValues {
	minPrice?: number
	maxPrice?: number
	available?: boolean
	sortBy?: string
	order?: 'asc' | 'desc'
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({ onFilterChange }) => {
	const [isOpen, setIsOpen] = useState(false)

	const handleOpen = () => setIsOpen(true)
	const handleClose = () => setIsOpen(false)

	return (
		<>
			<IconButton
				onClick={handleOpen}
				aria-label='open filters'
				sx={{
					color: 'var(--muted-foreground)',
					transition: 'all 0.2s ease',
					'&:hover': {
						color: 'var(--foreground)',
						backgroundColor: 'var(--muted-hover)',
					},
				}}
			>
				<FilterListIcon />
			</IconButton>

			<Drawer
				anchor='right'
				open={isOpen}
				onClose={handleClose}
				sx={{
					'& .MuiDrawer-paper': {
						width: {
							xs: '100%',
							sm: '400px',
							md: '33.333%',
						},
						maxWidth: '500px',
						backgroundColor: 'var(--background)',
						color: 'var(--foreground)',
						padding: 0,
						boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
					},
					'& .MuiBackdrop-root': {
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
					},
				}}
			>
				<div className='flex flex-col h-full'>
					<div className='flex items-center justify-between p-4 border-b border-border'>
						<h2 className='text-xl font-bold flex items-center gap-2'>
							<FilterListIcon />
							Filters
						</h2>
						<IconButton
							onClick={handleClose}
							size='small'
							aria-label='close filters'
							sx={{
								color: 'var(--muted-foreground)',
								'&:hover': {
									color: 'var(--foreground)',
									backgroundColor: 'var(--muted-hover)',
								},
							}}
						>
							<CloseIcon />
						</IconButton>
					</div>

					<div className='flex-1 overflow-y-auto p-4'>
						<div className='space-y-6'>
							<div className='text-center text-muted-foreground py-8'>
								<FilterListIcon sx={{ fontSize: 48, opacity: 0.3 }} />
								<p className='mt-2'>Filters will be here</p>
							</div>
						</div>
					</div>

					<div className='p-4 border-t border-border space-y-2'>
						<button
							className='w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium transition-all hover:bg-primary-hover'
							onClick={handleClose}
						>
							Apply Filters
						</button>
						<button
							className='w-full py-3 px-4 bg-secondary text-secondary-foreground rounded-lg font-medium transition-all hover:bg-secondary-hover'
							onClick={handleClose}
						>
							Cancel
						</button>
					</div>
				</div>
			</Drawer>
		</>
	)
}
