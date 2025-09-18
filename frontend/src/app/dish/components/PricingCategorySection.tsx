// frontend/src/app/dish/components/PricingCategorySection.tsx
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
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	return (
		<div className={isMobile ? 'mb-4' : 'mb-6'}>
			<h3
				className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold ${
					isMobile ? 'mb-3' : 'mb-4'
				} text-foreground flex items-center gap-2`}
			>
				💰 Pricing & Category
			</h3>
			<div
				className={`grid ${
					isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-6'
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
						required: 'Category ID is required',
						valueAsNumber: true,
						validate: {
							isPositive: v => v > 0 || 'Category ID must be greater than 0',
							isInteger: v => Number.isInteger(v) || 'Category ID must be an integer',
						},
					})}
					label='Category ID'
					type='number'
					error={errors.categoryId?.message}
				/>
			</div>
		</div>
	)
}
