'use client'

import type { BooleanFilterConfig } from '@/types/filter.interface'
import { FormControlLabel, Switch } from '@mui/material'

interface BooleanFilterProps {
	config: BooleanFilterConfig
	values: Record<string, any>
	onChange: (key: string, value: any) => void
}

export const BooleanFilter: React.FC<BooleanFilterProps> = ({
	config,
	values,
	onChange,
}) => {
	const value = values[config.key] ?? false

	return (
		<div className='space-y-2'>
			<FormControlLabel
				control={
					<Switch
						checked={value}
						onChange={e => onChange(config.key, e.target.checked)}
						disabled={config.disabled}
						sx={{
							'& .MuiSwitch-switchBase.Mui-checked': {
								color: 'var(--primary)',
							},
							'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
								backgroundColor: 'var(--primary)',
							},
						}}
					/>
				}
				label={config.label}
				sx={{
					'& .MuiFormControlLabel-label': {
						color: 'var(--foreground)',
						fontSize: '14px',
						fontWeight: 500,
					},
				}}
			/>
		</div>
	)
}
