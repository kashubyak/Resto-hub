'use client'

import type { SelectFilterConfig } from '@/types/filter.interface'
import { MenuItem, TextField } from '@mui/material'

interface SelectFilterProps {
	config: SelectFilterConfig
	values: Record<string, any>
	onChange: (key: string, value: any) => void
}

export const SelectFilter: React.FC<SelectFilterProps> = ({
	config,
	values,
	onChange,
}) => {
	const value = values[config.key] ?? ''

	return (
		<div className='space-y-2'>
			<label className='block text-sm font-medium text-foreground'>{config.label}</label>
			<TextField
				fullWidth
				select
				value={value}
				onChange={e => onChange(config.key, e.target.value || undefined)}
				placeholder={config.placeholder}
				size='small'
				disabled={config.disabled}
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
					'& .MuiSelect-icon': {
						color: 'var(--muted-foreground)',
					},
				}}
				SelectProps={{
					MenuProps: {
						PaperProps: {
							sx: {
								backgroundColor: 'var(--background)',
								color: 'var(--foreground)',
								'& .MuiMenuItem-root': {
									'&:hover': {
										backgroundColor: 'var(--muted-hover)',
									},
									'&.Mui-selected': {
										backgroundColor: 'var(--primary)',
										color: 'var(--primary-foreground)',
										'&:hover': {
											backgroundColor: 'var(--primary-hover)',
										},
									},
								},
							},
						},
					},
				}}
			>
				<MenuItem value=''>
					<em>None</em>
				</MenuItem>
				{config.options.map(option => (
					<MenuItem key={option.value} value={option.value}>
						{option.label}
					</MenuItem>
				))}
			</TextField>
		</div>
	)
}
