'use client'

import type { FilterConfig, FilterValues } from '@/types/filter.interface'
import CloseIcon from '@mui/icons-material/Close'
import FilterListIcon from '@mui/icons-material/FilterList'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { Drawer, IconButton } from '@mui/material'
import { useState } from 'react'
import { BooleanFilter } from '../elements/Filters/BooleanFilter'
import { RangeFilter } from '../elements/Filters/RangeFilter'
import { SelectFilter } from '../elements/Filters/SelectFilter'

interface FilterDrawerProps {
	filters: FilterConfig[]
	initialValues?: FilterValues
	onApply: (values: FilterValues) => void
	onReset?: () => void
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
	filters,
	initialValues = {},
	onApply,
	onReset,
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [filterValues, setFilterValues] = useState<FilterValues>(initialValues)

	const handleOpen = () => setIsOpen(true)
	const handleClose = () => setIsOpen(false)

	const handleChange = (key: string, value: any) => {
		setFilterValues(prev => ({
			...prev,
			[key]: value,
		}))
	}

	const handleApply = () => {
		const cleanedValues = Object.fromEntries(
			Object.entries(filterValues).filter(
				([_, value]) => value !== undefined && value !== null && value !== '',
			),
		)
		onApply(cleanedValues)
		handleClose()
	}

	const handleReset = () => {
		setFilterValues({})
		onReset?.()
		handleClose()
	}

	const renderFilter = (config: FilterConfig) => {
		switch (config.type) {
			case 'range':
				return (
					<RangeFilter
						key={config.key}
						config={config}
						values={filterValues}
						onChange={handleChange}
					/>
				)
			case 'boolean':
				return (
					<BooleanFilter
						key={config.key}
						config={config}
						values={filterValues}
						onChange={handleChange}
					/>
				)
			case 'select':
				return (
					<SelectFilter
						key={config.key}
						config={config}
						values={filterValues}
						onChange={handleChange}
					/>
				)
			default:
				return null
		}
	}

	const hasActiveFilters = Object.values(filterValues).some(
		value => value !== undefined && value !== null && value !== '',
	)

	return (
		<>
			<IconButton
				onClick={handleOpen}
				aria-label='open filters'
				sx={{
					color: hasActiveFilters ? 'var(--primary)' : 'var(--muted-foreground)',
					transition: 'all 0.2s ease',
					position: 'relative',
					'&:hover': {
						color: 'var(--foreground)',
						backgroundColor: 'var(--muted-hover)',
					},
				}}
			>
				<FilterListIcon />
				{hasActiveFilters && (
					<span className='absolute top-1 right-1 w-2 h-2 bg-primary rounded-full' />
				)}
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
					{/* Header */}
					<div className='flex items-center justify-between p-4 border-b border-border'>
						<h2 className='text-xl font-bold flex items-center gap-2'>
							<FilterListIcon />
							Filters
							{hasActiveFilters && (
								<span className='text-sm font-normal text-primary'>
									({Object.keys(filterValues).filter(key => filterValues[key]).length})
								</span>
							)}
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

					{/* Filters */}
					<div className='flex-1 overflow-y-auto p-4'>
						<div className='space-y-6'>{filters.map(filter => renderFilter(filter))}</div>
					</div>

					{/* Actions */}
					<div className='p-4 border-t border-border space-y-2'>
						<button
							className='w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium transition-all hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed'
							onClick={handleApply}
						>
							Apply Filters
						</button>
						{hasActiveFilters && (
							<button
								className='w-full py-3 px-4 bg-secondary text-secondary-foreground rounded-lg font-medium transition-all hover:bg-secondary-hover flex items-center justify-center gap-2'
								onClick={handleReset}
							>
								<RestartAltIcon fontSize='small' />
								Reset Filters
							</button>
						)}
						<button
							className='w-full py-3 px-4 bg-muted text-foreground rounded-lg font-medium transition-all hover:bg-muted-hover'
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
