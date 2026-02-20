import { useCategories } from '@/hooks/useCategories'
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	type SelectChangeEvent,
} from '@mui/material'
import { memo } from 'react'
import type {
	ControllerFieldState,
	ControllerRenderProps,
} from 'react-hook-form'

type ValueType = string | number | null | undefined
type FormValues = {
	[key: string]: ValueType
}

type FieldProps = ControllerRenderProps<FormValues, string> & {
	value: ValueType
	onChange: (value: ValueType) => void
}
type DropdownCategoryProps = FieldProps & {
	fieldState: ControllerFieldState
}

const MENU_PROPS_SX = {
	'& .MuiPaper-root': {
		marginTop: '0.5rem',
		borderRadius: '0.375rem',
		boxShadow:
			'0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
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
	'&.Mui-focusVisible': {
		backgroundColor: 'var(--muted-hover)',
	},
}

const INPUT_LABEL_SX = (isError: boolean) => ({
	color: isError
		? 'var(--destructive)'
		: 'color-mix(in oklab, var(--foreground) 70%, transparent)',
	'&.Mui-focused': {
		color: isError ? 'var(--destructive)' : 'var(--primary)',
	},
	'&.MuiInputLabel-shrink': {
		transform: 'translate(14px, -9px) scale(0.75)',
	},
	transform: 'translate(14px, 16px) scale(1)',
})

const SELECT_SX = (isError: boolean) => ({
	backgroundColor: 'var(--input)',
	color: 'var(--foreground)',

	'& .MuiOutlinedInput-notchedOutline': {
		borderColor: isError ? 'var(--destructive)' : 'var(--border)',
		borderWidth: '1px',
		borderRadius: '6px',
	},
	'&:hover .MuiOutlinedInput-notchedOutline': {
		borderColor: isError ? 'var(--destructive)' : 'var(--border)',
		borderWidth: '1px',
	},
	'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
		borderColor: isError ? 'var(--destructive)' : 'var(--primary)',
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
})

export const DropdownCategory = memo((props: DropdownCategoryProps) => {
	const { allCategories } = useCategories()
	const { fieldState, value, onChange, ...restFieldProps } = props

	const isError = !!fieldState.error
	const selectedValue = value ?? ''

	const handleChange = (event: SelectChangeEvent<ValueType>) => {
		const newValue = event.target.value

		if (newValue === '') onChange(null)
		else onChange(newValue)
	}

	return (
		<FormControl fullWidth error={isError}>
			<InputLabel id="dropdown-category-label" sx={INPUT_LABEL_SX(isError)}>
				Category
			</InputLabel>
			<Select
				labelId="dropdown-category-label"
				id="dropdown-category-select"
				{...restFieldProps}
				value={selectedValue}
				onChange={handleChange}
				label="Category"
				variant="outlined"
				sx={SELECT_SX(isError)}
				MenuProps={{
					sx: MENU_PROPS_SX,
				}}
			>
				<MenuItem value="" sx={MENU_ITEM_SX}>
					None
				</MenuItem>

				{allCategories.map((category) => (
					<MenuItem key={category.id} value={category.id} sx={MENU_ITEM_SX}>
						{category.name}
					</MenuItem>
				))}
			</Select>
			{isError && (
				<span className="text-[var(--destructive)] text-sm mt-1">
					{fieldState.error?.message}
				</span>
			)}
		</FormControl>
	)
})
DropdownCategory.displayName = 'DropdownCategory'
