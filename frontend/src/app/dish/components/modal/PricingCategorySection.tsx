'use client'

import { Input } from '@/components/ui/Input'
import type { IFormValues } from '@/types/dish.interface'
import { useMediaQuery, useTheme } from '@mui/material'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

type PricingCategorySectionProps = {
	register: UseFormRegister<IFormValues>
	errors: FieldErrors<IFormValues>
}

export const PricingCategorySection = ({
	register,
	errors,
}: PricingCategorySectionProps) => {
	const theme = useTheme()
	const isFullScreen = useMediaQuery(theme.breakpoints.down('sm'))

	return (
		<div className={isFullScreen ? 'mb-4' : 'mb-6'}>
			<h3
				className={`${isFullScreen ? 'text-base' : 'text-lg'} font-semibold ${
					isFullScreen ? 'mb-3' : 'mb-4'
				} text-foreground flex items-center gap-2`}
			>
				💰 Pricing & Category
			</h3>
			<div
				className={`grid ${
					isFullScreen ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-6'
				}`}
			>
				<Input
					register={register('price', {
						required: 'Dish price is required',
						valueAsNumber: true,
						validate: {
							isPositive: v => v > 0 || 'Price must be greater than 0',
							isNumber: v => !isNaN(v) || 'Price must be a number',
						},
					})}
					label='Price ($)'
					type='number'
					error={errors.price?.message}
				/>

				<Input
					register={register('categoryId', {
						setValueAs: v => (v === '' ? null : Number(v)),
						validate: value =>
							value == null ||
							(value > 0 && Number.isInteger(value)) ||
							'Category ID must be a positive integer',
					})}
					label='Category ID'
					type='number'
					error={errors.categoryId?.message}
				/>
			</div>
		</div>
	)
}
