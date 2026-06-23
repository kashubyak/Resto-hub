'use client'

import {
	selectMenuProps,
	selectTextFieldSx,
} from '@/components/ui/selectFieldStyles'
import { MenuItem, TextField } from '@mui/material'
import { memo, useCallback, useMemo } from 'react'

export interface FormSelectOption {
	value: string
	label: string
}

interface FormSelectProps {
	id?: string
	label: string
	value: string
	options: FormSelectOption[]
	onChange: (value: string) => void
	disabled?: boolean
	placeholder?: string
	size?: 'small' | 'medium'
	showLabel?: boolean
}

const FormSelectComponent: React.FC<FormSelectProps> = ({
	id,
	label,
	value,
	options,
	onChange,
	disabled = false,
	placeholder,
	size = 'medium',
	showLabel = true,
}) => {
	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
		[onChange],
	)

	const optionMenuItems = useMemo(
		() =>
			options.map((option) => (
				<MenuItem key={option.value} value={option.value}>
					{option.label}
				</MenuItem>
			)),
		[options],
	)

	return (
		<div className="space-y-2">
			{showLabel && (
				<label
					htmlFor={id}
					className="block text-sm font-medium text-foreground"
				>
					{label}
				</label>
			)}
			<TextField
				id={id}
				fullWidth
				select
				value={value}
				onChange={handleChange}
				placeholder={placeholder}
				size={size}
				disabled={disabled}
				sx={selectTextFieldSx}
				SelectProps={{
					displayEmpty: Boolean(placeholder),
					MenuProps: selectMenuProps,
				}}
			>
				{optionMenuItems}
			</TextField>
		</div>
	)
}

export const FormSelect = memo(FormSelectComponent)
