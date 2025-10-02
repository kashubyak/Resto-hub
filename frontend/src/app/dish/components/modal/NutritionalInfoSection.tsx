'use client'

import { Input } from '@/components/ui/Input'
import type { IDish } from '@/types/dish.interface'
import { caloriesValidation, weightValidation } from '@/validation/dish.validation'
import { useMediaQuery, useTheme } from '@mui/material'
import { memo } from 'react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

type NutritionalInfoSectionProps = {
	register: UseFormRegister<IDish>
	errors: FieldErrors<IDish>
}

const NutritionalInfoSectionFunction = ({
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
					register={register('weightGr', weightValidation)}
					label='Weight (grams)'
					type='number'
					error={errors.weightGr?.message}
				/>

				<Input
					register={register('calories', caloriesValidation)}
					label='Calories'
					type='number'
					error={errors.calories?.message}
				/>
			</div>
		</div>
	)
}
export const NutritionalInfoSection = memo(NutritionalInfoSectionFunction)
