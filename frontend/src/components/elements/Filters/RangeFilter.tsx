'use client'

import type { RangeFilterConfig } from '@/types/filter.interface'
import { TextField } from '@mui/material'

interface RangeFilterProps {
	config: RangeFilterConfig
	values: Record<string, string | number | boolean | undefined | null>
	onChange: (key: string, value: string | number | boolean | undefined | null) => void
}

export const RangeFilter: React.FC<RangeFilterProps> = ({ config, values, onChange }) => {
	const minValue = values[config.minKey] ?? ''
	const maxValue = values[config.maxKey] ?? ''

	return (
		<div className='space-y-2'>
			<label className='block text-sm font-medium text-foreground'>{config.label}</label>
			<div className='flex items-center gap-3'>
				<TextField
					fullWidth
					type='number'
					value={minValue}
					onChange={e =>
						onChange(config.minKey, e.target.value ? Number(e.target.value) : undefined)
					}
					placeholder={`Min ${config.suffix || ''}`}
					size='small'
					disabled={config.disabled}
					inputProps={{
						min: config.min,
						max: config.max,
						step: config.step || 1,
					}}
					sx={{
						'& .MuiOutlinedInput-root': {
							backgroundColor: 'var(--background)',
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
								borderWidth: '2px',
							},
						},
						'& .MuiInputBase-input': {
							color: 'var(--foreground)',
							padding: '8px 12px',
							fontSize: '14px',
						},
					}}
				/>
				<span className='text-muted-foreground'>—</span>
				<TextField
					fullWidth
					type='number'
					value={maxValue}
					onChange={e =>
						onChange(config.maxKey, e.target.value ? Number(e.target.value) : undefined)
					}
					placeholder={`Max ${config.suffix || ''}`}
					size='small'
					disabled={config.disabled}
					inputProps={{
						min: config.min,
						max: config.max,
						step: config.step || 1,
					}}
					sx={{
						'& .MuiOutlinedInput-root': {
							backgroundColor: 'var(--background)',
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
								borderWidth: '2px',
							},
						},
						'& .MuiInputBase-input': {
							color: 'var(--foreground)',
							padding: '8px 12px',
							fontSize: '14px',
						},
					}}
				/>
			</div>
			{config.prefix && (
				<p className='text-xs text-muted-foreground'>Values in {config.prefix}</p>
			)}
		</div>
	)
}
