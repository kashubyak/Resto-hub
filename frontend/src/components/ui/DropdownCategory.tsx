import { useCategories } from '@/hooks/useCategories'
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	type SelectChangeEvent,
} from '@mui/material'
import { memo, useCallback, useState } from 'react'

const MENU_PROPS_SX = {
	'& .MuiPaper-root': {
		marginTop: '0.5rem',
		borderRadius: '0.375rem',
		boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
		border: '1px solid var(--border)',
		backgroundColor: 'var(--muted)',
		color: 'var(--foreground)',
	},
	'& .MuiMenu-list': {
		padding: 0,
	},
}

const MENU_ITEM_SX = {
	paddingX: '1rem',
	paddingY: '0.75rem',
	borderBottom: '1px solid var(--border)',
	color: 'var(--foreground)',
	'&:last-child': {
		borderBottom: 'none',
	},
	'&:hover': {
		backgroundColor: 'var(--muted-hover)',
	},
	'&.Mui-selected': {
		backgroundColor: 'var(--active-item) !important',
	},
}

const INPUT_LABEL_SX = {
	color: 'color-mix(in oklab, var(--foreground) 70%, transparent)',
	'&.Mui-focused': {
		color: 'var(--primary)',
	},
	'&.MuiInputLabel-shrink': {
		transform: 'translate(14px, -9px) scale(0.75)',
	},
	transform: 'translate(14px, 16px) scale(1)',
}

const SELECT_SX = {
	backgroundColor: 'var(--input)',
	color: 'var(--foreground)',

	'& .MuiOutlinedInput-notchedOutline': {
		borderColor: 'var(--border)',
		borderWidth: '1px',
		borderRadius: '6px',
	},
	'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
		borderColor: 'var(--primary)',
		borderWidth: '2px',
	},
	'& .MuiSelect-select': {
		paddingLeft: '0.75rem',
		paddingTop: '1rem',
		paddingBottom: '1rem',
		color: 'var(--foreground)',
		paddingRight: '32px',
	},
	'& .MuiSelect-icon': {
		color: 'var(--muted-foreground)',
		right: '0.75rem',
	},
}

export const DropdownCategory = memo(() => {
	const { allCategories } = useCategories()
	const [selectedCategory, setSelectedCategory] = useState<string | number>('')

	const handleChange = useCallback((event: SelectChangeEvent<string | number>) => {
		setSelectedCategory(event.target.value)
	}, [])

	return (
		<FormControl fullWidth>
			<InputLabel id='dropdown-category-label' sx={INPUT_LABEL_SX}>
				Category
			</InputLabel>
			<Select
				labelId='dropdown-category-label'
				id='dropdown-category-select'
				value={selectedCategory}
				label='Category'
				onChange={handleChange}
				variant='outlined'
				sx={SELECT_SX}
				MenuProps={{
					sx: MENU_PROPS_SX,
				}}
			>
				<MenuItem value=''>None</MenuItem>

				{allCategories.map(category => (
					<MenuItem key={category.id} value={category.id} sx={MENU_ITEM_SX}>
						{category.name}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	)
})
DropdownCategory.displayName = 'DropdownCategory'
