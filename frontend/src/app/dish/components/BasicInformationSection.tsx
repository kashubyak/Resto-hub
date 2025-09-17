'use client'

import { Input } from '@/components/ui/Input'
import type { IFormValues } from '@/types/dish.interface'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

type BasicInformationSectionProps = {
	register: UseFormRegister<IFormValues>
	errors: FieldErrors<IFormValues>
}

export const BasicInformationSection = ({
	register,
	errors,
}: BasicInformationSectionProps) => {
	return (
		<div className='mb-6'>
			<h3 className='text-lg font-semibold mb-4 text-foreground flex items-center gap-2'>
				📝 Basic Information
			</h3>
			<div className='grid grid-cols-1 gap-4'>
				<Input
					register={register('name', {
						required: 'Dish name is required',
						validate: {
							minLength: v =>
								v.trim().length >= 2 || 'Dish name must be at least 2 characters',
							maxLength: v =>
								v.trim().length <= 100 || 'Dish name can be at most 100 characters',
							noOnlySpaces: v => v.trim().length > 0 || 'Dish name cannot be only spaces',
							validCharacters: v =>
								/^[\p{L}\p{N}\s\-&.,'()]+$/u.test(v) ||
								'Dish name can only contain letters, numbers, spaces, and basic punctuation',
							noConsecutiveSpaces: v =>
								!/\s{2,}/.test(v) || 'Dish name cannot have consecutive spaces',
							startsWithLetter: v =>
								/^[\p{L}]/u.test(v) || 'Dish name must start with a letter',
						},
					})}
					label='Dish Name'
					error={errors.name?.message}
					type='text'
				/>

				<Input
					register={register('description', {
						required: 'Dish description is required',
						validate: {
							minLength: v =>
								v.trim().length >= 5 || 'Description must be at least 5 characters',
							maxLength: v =>
								v.trim().length <= 1000 || 'Description can be at most 1000 characters',
							noOnlySpaces: v =>
								v.trim().length > 0 || 'Description cannot be only spaces',
							validCharacters: v =>
								/^[\p{L}\p{N}\s\-&.,'()!?]+$/u.test(v) ||
								'Description can only contain letters, numbers, spaces, and basic punctuation',
							noConsecutiveSpaces: v =>
								!/\s{2,}/.test(v) || 'Description cannot have consecutive spaces',
						},
					})}
					label='Dish Description'
					error={errors.description?.message}
					multiline
					rows={4}
				/>
			</div>
		</div>
	)
}
