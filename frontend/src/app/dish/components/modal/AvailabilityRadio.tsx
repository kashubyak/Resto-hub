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

interface AvailabilityRadioProps {
	control: Control<IDishFormValues>
	variant?: 'default' | 'cards'
}

const AvailabilityRadioFunction = ({
	control,
	variant = 'default',
}: AvailabilityRadioProps) => {
	const theme = useTheme()
	const isFullScreen = useMediaQuery(theme.breakpoints.down('sm'))

	return (
		<Controller
			name="available"
			control={control}
			defaultValue={true}
			render={({ field: { value, onChange } }) =>
				variant === 'cards' ? (
					<div className="grid grid-cols-2 gap-3">
						<label className="relative cursor-pointer">
							<input
								type="radio"
								checked={value === true}
								onChange={() => onChange(true)}
								className="sr-only peer"
							/>
							<div className="h-11 flex items-center justify-center gap-2 px-3 rounded-lg border-2 border-border bg-background peer-checked:border-green-500 peer-checked:bg-green-500/5 transition-all">
								<div
									className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
										value === true
											? 'border-green-500 bg-green-500'
											: 'border-border'
									}`}
								>
									{value === true && (
										<div className="w-2 h-2 rounded-full bg-white" />
									)}
								</div>
								<span className="text-sm font-medium text-foreground">
									Available
								</span>
							</div>
						</label>
						<label className="relative cursor-pointer">
							<input
								type="radio"
								checked={value === false}
								onChange={() => onChange(false)}
								className="sr-only peer"
							/>
							<div className="h-11 flex items-center justify-center gap-2 px-3 rounded-lg border-2 border-border bg-background peer-checked:border-red-500 peer-checked:bg-red-500/5 transition-all">
								<div
									className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
										value === false
											? 'border-red-500 bg-red-500'
											: 'border-border'
									}`}
								>
									{value === false && (
										<div className="w-2 h-2 rounded-full bg-white" />
									)}
								</div>
								<span className="text-sm font-medium text-foreground">
									Unavailable
								</span>
							</div>
						</label>
					</div>
				) : (
					<FormControl component="fieldset">
						<FormLabel
							component="legend"
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
							onChange={(e) => onChange(e.target.value === 'true')}
							row={!isFullScreen}
							sx={{
								gap: isFullScreen ? '0.5rem' : '1rem',
								flexDirection: 'row',
							}}
						>
							<FormControlLabel
								value="true"
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
								label="Available"
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
								value="false"
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
								label="Not Available"
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
				)
			}
		/>
	)
}

export const AvailabilityRadio = memo(AvailabilityRadioFunction)
