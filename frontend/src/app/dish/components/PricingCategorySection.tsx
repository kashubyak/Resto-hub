'use client'

import { Input } from '@/components/ui/Input'
import type { IFormValues } from '@/types/dish.interface'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

type PricingCategorySectionProps = {
	register: UseFormRegister<IFormValues>
	errors: FieldErrors<IFormValues>
}

export const PricingCategorySection = ({
	register,
	errors,
}: PricingCategorySectionProps) => {
	return (
		<div className='mb-6'>
			<h3 className='text-lg font-semibold mb-4 text-foreground flex items-center gap-2'>
				💰 Pricing & Category
			</h3>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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
