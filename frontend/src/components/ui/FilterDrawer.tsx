'use client'

import type { FilterConfig, FilterValue, FilterValues } from '@/types/filter.interface'
import CloseIcon from '@mui/icons-material/Close'
import FilterListIcon from '@mui/icons-material/FilterList'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { Drawer, IconButton } from '@mui/material'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { BooleanFilter } from '../elements/Filters/BooleanFilter'
import { RangeFilter } from '../elements/Filters/RangeFilter'
import { SelectFilter } from '../elements/Filters/SelectFilter'
import { Button } from './Button'

interface FilterDrawerProps {
	filters: FilterConfig[]
	initialValues?: FilterValues
	onApply: (values: FilterValues) => void
	onReset?: () => void
}

const drawerSx = {
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
		boxShadow: '-4px 0 20px var(--shadow)',
	},
	'& .MuiBackdrop-root': {
		backgroundColor: 'rgba(var(--background-rgb), 0.3)',
		backdropFilter: 'blur(8px)',
	},
}

const iconButtonSx = {
	color: 'var(--muted-foreground)',
	'&:hover': {
		color: 'var(--foreground)',
		backgroundColor: 'var(--muted-hover)',
	},
}

const FilterDrawerComponent: React.FC<FilterDrawerProps> = ({
	filters,
	initialValues = {},
	onApply,
	onReset,
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [filterValues, setFilterValues] = useState<FilterValues>(initialValues)

	useEffect(() => setFilterValues(initialValues), [initialValues])
	const handleOpen = useCallback(() => setIsOpen(true), [])
	const handleClose = useCallback(() => setIsOpen(false), [])

	const handleChange = useCallback((key: string, value: FilterValue) => {
		setFilterValues(prev => ({
			...prev,
			[key]: value,
		}))
	}, [])

	const handleApply = useCallback(() => {
		const cleanedValues = Object.fromEntries(
			Object.entries(filterValues).filter(
				([, value]) => value !== undefined && value !== null && value !== '',
			),
		)
		onApply(cleanedValues)
		handleClose()
	}, [filterValues, onApply, handleClose])

	const handleReset = useCallback(() => {
		setFilterValues({})
		onReset?.()
	}, [onReset])

	const renderFilter = useCallback(
		(config: FilterConfig) => {
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
		},
		[filterValues, handleChange],
	)

	const hasActiveFilters = useMemo(
		() =>
			Object.values(filterValues).some(
				value => value !== undefined && value !== null && value !== '',
			),
		[filterValues],
	)

	const activeFiltersCount = useMemo(
		() => Object.keys(filterValues).filter(key => filterValues[key]).length,
		[filterValues],
	)

	const iconButtonDynamicSx = useMemo(
		() => ({
			...iconButtonSx,
			color: hasActiveFilters ? 'var(--primary)' : 'var(--muted-foreground)',
		}),
		[hasActiveFilters],
	)

	return (
		<>
			<IconButton onClick={handleOpen} aria-label='open filters' sx={iconButtonDynamicSx}>
				<FilterListIcon />
				{hasActiveFilters && (
					<span className='absolute top-1 right-1 w-2 h-2 bg-primary rounded-full' />
				)}
			</IconButton>

			<Drawer anchor='right' open={isOpen} onClose={handleClose} sx={drawerSx}>
				<div className='flex flex-col h-full'>
					<div className='flex items-center justify-between p-4 border-b border-border'>
						<h2 className='text-xl font-bold flex items-center gap-2'>
							<FilterListIcon />
							Filters
							{hasActiveFilters && (
								<span className='text-sm font-normal text-primary'>
									({activeFiltersCount})
								</span>
							)}
						</h2>
						<IconButton
							onClick={handleClose}
							size='small'
							aria-label='close filters'
							sx={iconButtonSx}
						>
							<CloseIcon />
						</IconButton>
					</div>

					<div className='flex-1 overflow-y-auto p-4'>
						<div className='space-y-6'>{filters.map(renderFilter)}</div>
					</div>

					<div className='p-4 border-t border-border space-y-2'>
						<div className='flex justify-between gap-2'>
							<Button onClick={handleClose} text='Cancel' />
							<Button onClick={handleApply} text='Apply Filters' />
						</div>
						{hasActiveFilters && (
							<Button onClick={handleReset}>
								<RestartAltIcon fontSize='small' />
								Reset Filters
							</Button>
						)}
					</div>
				</div>
			</Drawer>
		</>
	)
}

export const FilterDrawer = memo(FilterDrawerComponent)
