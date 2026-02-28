'use client'

import type { RangeFilterConfig } from '@/types/filter.interface'
import { TextField } from '@mui/material'
import { memo, useCallback, useMemo } from 'react'

interface RangeFilterProps {
	config: RangeFilterConfig
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
}

const RangeFilterComponent: React.FC<RangeFilterProps> = ({
	config,
	values,
	onChange,
}) => {
	const minValue = values[config.minKey] ?? ''
	const maxValue = values[config.maxKey] ?? ''

	const handleMinChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			onChange(
				config.minKey,
				e.target.value ? Number(e.target.value) : undefined,
			),
		[config.minKey, onChange],
	)

	const handleMaxChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			onChange(
				config.maxKey,
				e.target.value ? Number(e.target.value) : undefined,
			),
		[config.maxKey, onChange],
	)

	const inputProps = useMemo(
		() => ({
			min: config.min,
			max: config.max,
			step: config.step || 1,
		}),
		[config.min, config.max, config.step],
	)

	const minPlaceholder = useMemo(
		() => `Min ${config.suffix || ''}`,
		[config.suffix],
	)
	const maxPlaceholder = useMemo(
		() => `Max ${config.suffix || ''}`,
		[config.suffix],
	)

	return (
		<div className="space-y-2">
			<label className="block text-sm font-medium text-foreground">
				{config.label}
			</label>
			<div className="flex items-center gap-3">
				<TextField
					fullWidth
					type="number"
					value={minValue}
					onChange={handleMinChange}
					placeholder={minPlaceholder}
					size="small"
					disabled={config.disabled}
					inputProps={inputProps}
					sx={textFieldSx}
				/>
				<span className="text-muted-foreground">—</span>
				<TextField
					fullWidth
					type="number"
					value={maxValue}
					onChange={handleMaxChange}
					placeholder={maxPlaceholder}
					size="small"
					disabled={config.disabled}
					inputProps={inputProps}
					sx={textFieldSx}
				/>
			</div>
			{config.prefix && (
				<p className="text-xs text-muted-foreground">
					Values in {config.prefix}
				</p>
			)}
		</div>
	)
}

export const RangeFilter = memo(RangeFilterComponent)
