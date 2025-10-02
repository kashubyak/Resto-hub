'use client'

import { UploadImage } from '@/components/elements/UploadImage'
import type { IDishFormValues } from '@/types/dish.interface'
import { imageValidation } from '@/validation/dish.validation'
import { memo } from 'react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

type ImageUploadSectionProps = {
	register: UseFormRegister<IDishFormValues>
	errors: FieldErrors<IDishFormValues>
}

const ImageUploadSectionFunction = ({ register, errors }: ImageUploadSectionProps) => {
	return (
		<div className='mb-6'>
			<h3 className='text-lg font-semibold mb-4 text-foreground flex items-center gap-2'>
				📸 Dish Image
			</h3>
			<div className='rounded-lg p-4 border border-border'>
				<UploadImage
					label='Upload dish image'
					register={register('imageUrl', imageValidation)}
					error={errors.imageUrl?.message}
				/>
			</div>
		</div>
	)
}
export const ImageUploadSection = memo(ImageUploadSectionFunction)
