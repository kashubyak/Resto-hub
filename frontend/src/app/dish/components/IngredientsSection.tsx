'use client'

import { IngredientsInput } from '@/components/ui/IngredientsInput'
import type { IFormValues } from '@/types/dish.interface'
import type { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'

type IngredientsSectionProps = {
	register: UseFormRegister<IFormValues>
	setValue: UseFormSetValue<IFormValues>
	errors: FieldErrors<IFormValues>
}

export const IngredientsSection = ({
	register,
	setValue,
	errors,
}: IngredientsSectionProps) => {
	return (
		<div className='mb-6'>
			<h3 className='text-lg font-semibold mb-4 text-foreground flex items-center gap-2'>
				🥕 Ingredients
			</h3>
			<div className='rounded-lg p-4 border border-border'>
				<IngredientsInput
					setValue={setValue}
					error={errors.ingredients?.message}
					label='Add ingredients'
					register={register('ingredients', {
						required: 'At least one ingredient is required',
						validate: {
							notEmpty: v =>
								(Array.isArray(v) && v.length > 0) ||
								'Please add at least one ingredient',
							validEach: v =>
								v.every(
									(i: string) =>
										/^[\p{L}\s\-&.,'()]+$/u.test(i) &&
										i.trim().length >= 2 &&
										i.trim().length <= 50,
								) ||
								'Each ingredient must be 2–50 chars and contain only valid characters',
							noDuplicates: v =>
								new Set(v.map(i => i.toLowerCase())).size === v.length ||
								'Ingredients must not contain duplicates',
						},
					})}
				/>
			</div>
		</div>
	)
}
