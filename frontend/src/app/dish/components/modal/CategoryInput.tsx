'use client'

import { DropdownCategory } from '@/components/ui/DropdownCategory'
import type { IDishFormValues } from '@/types/dish.interface'
import { categoryIdValidation } from '@/validation/dish.validation'
import { memo } from 'react'
import { Controller, type Control } from 'react-hook-form'

type CategoryInputProps = {
	control: Control<IDishFormValues>
}

const CategoryInputFunction = ({ control }: CategoryInputProps) => {
	return (
		<Controller
			name="categoryId"
			control={control}
			rules={categoryIdValidation}
			render={({ field, fieldState }) => (
				<DropdownCategory {...field} fieldState={fieldState} />
			)}
		/>
	)
}

export const CategoryInput = memo(CategoryInputFunction)
