'use client'

import { Input } from '@/components/ui/Input'
import type { IDishFormValues } from '@/types/dish.interface'
import { priceValidation } from '@/validation/dish.validation'
import { memo } from 'react'
import { Controller, type Control, type UseFormRegister } from 'react-hook-form'

type PriceInputProps = {
	register?: UseFormRegister<IDishFormValues>
	control: Control<IDishFormValues>
	mode?: 'create' | 'update'
	trigger?: (field: keyof IDishFormValues) => Promise<boolean>
}

const PriceInputFunction = ({
	register,
	control,
	mode = 'create',
	trigger,
}: PriceInputProps) => {
	return (
		<Controller
			name='price'
			control={control}
			rules={priceValidation}
			render={({ field, fieldState }) => (
				<Input
					{...(mode === 'create' && register ? field : {})}
					label='Price ($)'
					type='text'
					value={field.value ?? ''}
					error={fieldState.error?.message}
					onChange={e => {
						const v = e.target.value.replace(',', '.')
						field.onChange(v)
					}}
					{...(mode === 'update' && { onBlur: () => trigger?.('price') })}
				/>
			)}
		/>
	)
}

export const PriceInput = memo(PriceInputFunction)
