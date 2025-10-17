'use client'

import type { IDishFormValues } from '@/types/dish.interface'
import {
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
	useMediaQuery,
	useTheme,
} from '@mui/material'
import { memo } from 'react'
import { Controller, type Control } from 'react-hook-form'

type AvailabilityRadioProps = {
	control: Control<IDishFormValues>
}

const AvailabilityRadioFunction = ({ control }: AvailabilityRadioProps) => {
	const theme = useTheme()
	const isFullScreen = useMediaQuery(theme.breakpoints.down('sm'))

	return (
		<Controller
			name='available'
			control={control}
			defaultValue={true}
			render={({ field: { value, onChange } }) => (
				<FormControl component='fieldset'>
					<FormLabel
						component='legend'
						sx={{
							color: 'var(--foreground)',
							fontSize: '1rem',
							fontWeight: 600,
							marginBottom: '0.75rem',
							whiteSpace: 'nowrap',
							'&.Mui-focused': {
								color: 'var(--foreground)',
							},
						}}
					>
						🍽️ Dish Availability
					</FormLabel>
					<RadioGroup
						value={String(value)}
						onChange={e => onChange(e.target.value === 'true')}
						row={!isFullScreen}
						sx={{
							gap: isFullScreen ? '0.5rem' : '1rem',
							flexDirection: 'row',
						}}
					>
						<FormControlLabel
							value='true'
							control={
								<Radio
									sx={{
										color: 'var(--muted-foreground)',
										'&.Mui-checked': {
											color: 'var(--success)',
										},
										'&:hover': {
											backgroundColor:
												'color-mix(in oklab, var(--success) 10%, transparent)',
										},
									}}
								/>
							}
							label='Available'
							sx={{
								'& .MuiFormControlLabel-label': {
									color: 'var(--foreground)',
									fontSize: isFullScreen ? '0.875rem' : '0.95rem',
									fontWeight: value === true ? 600 : 400,
								},
								margin: 0,
							}}
						/>
						<FormControlLabel
							value='false'
							control={
								<Radio
									sx={{
										color: 'var(--muted-foreground)',
										'&.Mui-checked': {
											color: 'var(--destructive)',
										},
										'&:hover': {
											backgroundColor:
												'color-mix(in oklab, var(--destructive) 10%, transparent)',
										},
									}}
								/>
							}
							label='Not Available'
							sx={{
								'& .MuiFormControlLabel-label': {
									color: 'var(--foreground)',
									fontSize: isFullScreen ? '0.875rem' : '0.95rem',
									fontWeight: value === false ? 600 : 400,
								},
								margin: 0,
							}}
						/>
					</RadioGroup>
				</FormControl>
			)}
		/>
	)
}

export const AvailabilityRadio = memo(AvailabilityRadioFunction)
