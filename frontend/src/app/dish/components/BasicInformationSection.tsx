'use client'

import { Input } from '@/components/ui/Input'
import type { IFormValues } from '@/types/dish.interface'
import { useMediaQuery, useTheme } from '@mui/material'
import type { FieldErrors, UseFormRegister, UseFormWatch } from 'react-hook-form'

type BasicInformationSectionProps = {
	register: UseFormRegister<IFormValues>
	errors: FieldErrors<IFormValues>
	watch: UseFormWatch<IFormValues>
}

export const BasicInformationSection = ({
	register,
	errors,
	watch,
}: BasicInformationSectionProps) => {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('md'))

	const descriptionValue = watch('description') || ''
	const descriptionLength = descriptionValue.length
	const maxDescriptionLength = 1000

	return (
		<div className={isMobile ? 'mb-4' : 'mb-6'}>
			<h3
				className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold ${
					isMobile ? 'mb-3' : 'mb-4'
				} text-foreground flex items-center gap-2`}
			>
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
				/>

				<div className='relative'>
					<Input
						register={register('description', {
							required: 'Dish description is required',
							validate: {
								minLength: v =>
									v.trim().length >= 5 || 'Description must be at least 5 characters',
								maxLength: v =>
									v.trim().length <= maxDescriptionLength ||
									`Description can be at most ${maxDescriptionLength} characters`,
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
						rows={isMobile ? 3 : 4}
					/>
					<p className='text-xs text-secondary-foreground mt-1 text-right'>
						{descriptionLength} / {maxDescriptionLength}
					</p>
				</div>
			</div>
		</div>
	)
}
