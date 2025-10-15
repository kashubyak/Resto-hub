'use client'

import { Input } from '@/components/ui/Input'
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
			name='categoryId'
			control={control}
			rules={categoryIdValidation}
			render={({ field, fieldState }) => (
				<Input
					{...field}
					label='Category ID'
					type='number'
					value={field.value ?? ''}
					error={fieldState.error?.message}
					onChange={e => {
						const val = e.target.value === '' ? undefined : Number(e.target.value)
						field.onChange(val)
					}}
				/>
			)}
		/>
	)
}

export const CategoryInput = memo(CategoryInputFunction)
