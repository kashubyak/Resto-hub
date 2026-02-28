'use client'

import { useCategories } from '@/hooks/useCategories'
import { MenuItem, TextField } from '@mui/material'
import { memo, useCallback, useMemo } from 'react'

interface CategoryFilterProps {
	values: Record<string, string | number | boolean | undefined | null>
	onChange: (
		key: string,
		value: string | number | boolean | undefined | null,
	) => void
}

const textFieldSx = {
	'& .MuiOutlinedInput-root': {
		backgroundColor: 'var(--input)',
		color: 'var(--foreground)',
		borderRadius: '8px',
		'& fieldset': {
			borderColor: 'var(--border)',
		},
		'&:hover fieldset': {
			borderColor: 'var(--primary)',
		},
		'&.Mui-focused fieldset': {
			borderColor: 'var(--primary)',
			borderWidth: '1px',
		},
	},
	'& .MuiInputBase-input': {
		color: 'var(--foreground)',
		padding: '8px 12px',
		fontSize: '14px',
	},
	'& .MuiSelect-icon': {
		color: 'var(--muted-foreground)',
	},
}

const menuProps = {
	PaperProps: {
		sx: {
			backgroundColor: 'var(--muted)',
			color: 'var(--foreground)',
			border: '0.3px solid var(--border)',
			borderRadius: '8px',
			marginTop: '2px',
			'& .MuiList-root': {
				paddingTop: 0,
				paddingBottom: 0,
			},
			'& .MuiMenuItem-root': {
				borderTop: '0.3px solid var(--border)',
				padding: '8px 12px',
				'&:hover': {
					backgroundColor: 'var(--muted-hover)',
				},
				'&.Mui-selected': {
					backgroundColor: 'var(--primary)',
					color: 'var(--stable-light)',
					'&:hover': {
						backgroundColor: 'var(--primary-hover)',
					},
				},
				'&:first-of-type': {
					borderTopLeftRadius: '8px',
					borderTopRightRadius: '8px',
					borderTop: '0px',
				},
				'&:last-of-type': {
					borderBottomLeftRadius: '8px',
					borderBottomRightRadius: '8px',
				},
			},
		},
	},
}

const CategoryFilterComponent: React.FC<CategoryFilterProps> = ({
	values,
	onChange,
}) => {
	const { allCategories, isLoading } = useCategories()
	const value = values.categoryId ?? ''

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			onChange('categoryId', e.target.value ? Number(e.target.value) : undefined),
		[onChange],
	)

	const emptyMenuItem = useMemo(
		() => (
			<MenuItem value="">
				<em>All categories</em>
			</MenuItem>
		),
		[],
	)

	const categoryMenuItems = useMemo(
		() =>
			allCategories.map((category) => (
				<MenuItem key={category.id} value={category.id}>
					{category.icon} {category.name}
				</MenuItem>
			)),
		[allCategories],
	)

	return (
		<div className="space-y-2">
			<label className="block text-sm font-medium text-foreground">
				Category
			</label>
			<TextField
				fullWidth
				select
				value={value}
				onChange={handleChange}
				placeholder="All categories"
				size="small"
				disabled={isLoading}
				sx={textFieldSx}
				SelectProps={{
					displayEmpty: true,
					MenuProps: menuProps,
				}}
			>
				{emptyMenuItem}
				{categoryMenuItems}
			</TextField>
		</div>
	)
}

export const CategoryFilter = memo(CategoryFilterComponent)
