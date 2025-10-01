'use client'

import { Input } from '@/components/ui/Input'
import type { IFormValues } from '@/types/dish.interface'
import { dishNameValidation } from '@/validation/dish.validation'
import { useMediaQuery, useTheme } from '@mui/material'
import type { FieldErrors, UseFormRegister, UseFormWatch } from 'react-hook-form'

type BasicInformationSectionProps = {
	register: UseFormRegister<IFormValues>
	errors: FieldErrors<IFormValues>
	watch: UseFormWatch<IFormValues>
}

const maxDescriptionLength = 1500
export const BasicInformationSection = ({
	register,
	errors,
	watch,
}: BasicInformationSectionProps) => {
	const theme = useTheme()
	const isFullScreen = useMediaQuery(theme.breakpoints.down('sm'))

	const descriptionValue = watch('description') || ''
	const descriptionLength = descriptionValue.length

	return (
		<div className={isFullScreen ? 'mb-4' : 'mb-6'}>
			<h3
				className={`${isFullScreen ? 'text-base' : 'text-lg'} font-semibold ${
					isFullScreen ? 'mb-3' : 'mb-4'
				} text-foreground flex items-center gap-2`}
			>
				📝 Basic Information
			</h3>
			<div className='grid grid-cols-1 gap-4'>
				<Input
					register={register('name', dishNameValidation)}
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
							},
						})}
						label='Dish Description'
						error={errors.description?.message}
						multiline
						rows={isFullScreen ? 3 : 4}
					/>

					<p className='text-xs text-secondary-foreground mt-1 text-right'>
						{descriptionLength} / {maxDescriptionLength}
					</p>
				</div>
			</div>
		</div>
	)
}
