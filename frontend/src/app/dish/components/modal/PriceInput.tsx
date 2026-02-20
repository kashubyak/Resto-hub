'use client'

import { Input } from '@/components/ui/Input'
import type { IDishFormValues } from '@/types/dish.interface'
import {
	priceValidation,
	VALID_NUMBER_PATTERN,
} from '@/validation/dish.validation'
import { memo, useCallback } from 'react'
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
	const handlePriceChange = useCallback(
		(onChange: (value: string) => void) =>
			(e: React.ChangeEvent<HTMLInputElement>) => {
				let value = e.target.value

				if (value === '') {
					onChange('')
					return
				}
				value = value.replace(',', '.')
				if (VALID_NUMBER_PATTERN.test(value)) onChange(value)
			},
		[],
	)

	const handleBlur = useCallback(() => {
		if (mode === 'update') trigger?.('price')
	}, [mode, trigger])

	return (
		<Controller
			name="price"
			control={control}
			rules={priceValidation}
			render={({ field, fieldState }) => {
				const displayValue =
					typeof field.value === 'number'
						? field.value.toString()
						: (field.value ?? '')

				return (
					<Input
						{...(mode === 'create' && register
							? { name: field.name, ref: field.ref }
							: {})}
						label="Price ($)"
						type="text"
						value={displayValue}
						error={fieldState.error?.message}
						onChange={handlePriceChange(field.onChange)}
						onBlur={handleBlur}
					/>
				)
			}}
		/>
	)
}

export const PriceInput = memo(PriceInputFunction)
