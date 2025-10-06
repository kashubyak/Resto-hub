'use client'

import type { SelectFilterConfig } from '@/types/filter.interface'
import { MenuItem, TextField } from '@mui/material'

interface SelectFilterProps {
	config: SelectFilterConfig
	values: Record<string, string | number | boolean | undefined | null>
	onChange: (key: string, value: string | number | boolean | undefined | null) => void
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
				}}
				SelectProps={{
					displayEmpty: true,
					MenuProps: {
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
					},
				}}
			>
				<MenuItem value=''>
					<em>{config.placeholder || 'None'}</em>
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
