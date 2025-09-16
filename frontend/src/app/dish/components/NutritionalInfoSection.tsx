'use client'

import { Input } from '@/components/ui/Input'
import type { IFormValues } from '@/hooks/useDishModal'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

type NutritionalInfoSectionProps = {
	register: UseFormRegister<IFormValues>
	errors: FieldErrors<IFormValues>
}

export const NutritionalInfoSection = ({
	register,
	errors,
}: NutritionalInfoSectionProps) => {
	return (
		<div>
			<h3 className='text-lg font-semibold mb-4 text-foreground flex items-center gap-2'>
				📊 Nutritional Information
			</h3>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<Input
					register={register('weightGr', {
						required: 'Dish weight is required',
						valueAsNumber: true,
						validate: {
							isPositive: v => v > 0 || 'Weight must be greater than 0',
							maxValue: v => v <= 100000 || 'Weight is too large',
						},
					})}
					label='Weight (grams)'
					type='number'
					error={errors.weightGr?.message}
				/>

				<Input
					register={register('calories', {
						required: 'Calories are required',
						valueAsNumber: true,
						validate: {
							isPositive: v => v > 0 || 'Calories must be greater than 0',
							maxValue: v => v <= 5000 || 'Calories value is unrealistic',
						},
					})}
					label='Calories'
					type='number'
					error={errors.calories?.message}
				/>
			</div>
		</div>
	)
}
