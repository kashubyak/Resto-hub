'use client'

import { Input } from '@/components/ui/Input'
import type { IFormValues } from '@/types/dish.interface'
import { useMediaQuery, useTheme } from '@mui/material'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

type NutritionalInfoSectionProps = {
	register: UseFormRegister<IFormValues>
	errors: FieldErrors<IFormValues>
}

export const NutritionalInfoSection = ({
	register,
	errors,
}: NutritionalInfoSectionProps) => {
	const theme = useTheme()
	const isFullScreen = useMediaQuery(theme.breakpoints.down('sm'))

	return (
		<div>
			<h3
				className={`${isFullScreen ? 'text-base' : 'text-lg'} font-semibold ${
					isFullScreen ? 'mb-3' : 'mb-4'
				} text-foreground flex items-center gap-2`}
			>
				📊 Nutritional Information
			</h3>
			<div
				className={`grid ${
					isFullScreen ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-6'
				}`}
			>
				<Input
					register={register('weightGr', {
						setValueAs: v => (v === '' ? null : Number(v)),
						validate: value =>
							value == null || value > 0 || 'Weight must be greater than 0',
					})}
					label='Weight (grams)'
					type='number'
					error={errors.weightGr?.message}
				/>

				<Input
					register={register('calories', {
						setValueAs: v => (v === '' ? null : Number(v)),
						validate: value =>
							value == null || value > 0 || 'Calories must be greater than 0',
					})}
					label='Calories'
					type='number'
					error={errors.calories?.message}
				/>
			</div>
		</div>
	)
}
