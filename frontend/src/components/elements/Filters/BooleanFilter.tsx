'use client'

import type { BooleanFilterConfig } from '@/types/filter.interface'
import { FormControlLabel, Switch } from '@mui/material'

interface BooleanFilterProps {
	config: BooleanFilterConfig
	values: Record<string, string | number | boolean | undefined | null>
	onChange: (key: string, value: string | number | boolean | undefined | null) => void
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
						checked={Boolean(value)}
						onChange={e => onChange(config.key, e.target.checked)}
						disabled={config.disabled}
						sx={{
							'& .MuiSwitch-switchBase': {
								color: 'var(--muted-foreground)',
							},
							'& .MuiSwitch-switchBase.Mui-checked': {
								color: 'var(--primary)',
							},
							'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
								backgroundColor: 'var(--primary)',
								opacity: 1,
							},
							'& .MuiSwitch-track': {
								backgroundColor: 'var(--muted)',
								border: '1px solid var(--border)',
								opacity: 1,
							},
							'& .MuiSwitch-thumb': {
								backgroundColor: 'var(--stable-light)',
							},
							'&.Mui-disabled': {
								opacity: 0.6,
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
