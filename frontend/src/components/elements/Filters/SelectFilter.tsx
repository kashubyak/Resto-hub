'use client'

import {
	selectMenuProps,
	selectTextFieldSx,
} from '@/components/ui/selectFieldStyles'
import type { SelectFilterConfig } from '@/types/filter.interface'
import { MenuItem, TextField } from '@mui/material'
import { memo, useCallback, useMemo } from 'react'

interface SelectFilterProps {
	config: SelectFilterConfig
	values: Record<string, string | number | boolean | undefined | null>
	onChange: (
		key: string,
		value: string | number | boolean | undefined | null,
	) => void
}

const SelectFilterComponent: React.FC<SelectFilterProps> = ({
	config,
	values,
	onChange,
}) => {
	const value = values[config.key] ?? ''

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			onChange(config.key, e.target.value || undefined),
		[config.key, onChange],
	)

	const emptyMenuItem = useMemo(
		() => (
			<MenuItem value="">
				<em>{config.placeholder ?? 'None'}</em>
			</MenuItem>
		),
		[config.placeholder],
	)

	const optionMenuItems = useMemo(
		() =>
			config.options.map((option) => (
				<MenuItem key={option.value} value={option.value}>
					{option.label}
				</MenuItem>
			)),
		[config.options],
	)

	return (
		<div className="space-y-2">
			<label className="block text-sm font-medium text-foreground">
				{config.label}
			</label>
			<TextField
				fullWidth
				select
				value={value}
				onChange={handleChange}
				placeholder={config.placeholder}
				size="small"
				disabled={config.disabled}
				sx={selectTextFieldSx}
				SelectProps={{
					displayEmpty: true,
					MenuProps: selectMenuProps,
				}}
			>
				{emptyMenuItem}
				{optionMenuItems}
			</TextField>
		</div>
	)
}

export const SelectFilter = memo(SelectFilterComponent)
