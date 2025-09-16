'use client'

import { UploadImage } from '@/components/elements/UploadImage'
import type { IFormValues } from '@/hooks/useDishModal'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'


type ImageUploadSectionProps = {
	register: UseFormRegister<IFormValues>
	errors: FieldErrors<IFormValues>
}

export const ImageUploadSection = ({ register, errors }: ImageUploadSectionProps) => {
	return (
		<div className='mb-6'>
			<h3 className='text-lg font-semibold mb-4 text-foreground flex items-center gap-2'>
				📸 Dish Image
			</h3>
			<div className='rounded-lg p-4 border border-border'>
				<UploadImage
					label='Upload dish image'
					register={register('imageUrl', {
						required: 'Dish image is required',
						validate: {
							validType: v =>
								!v?.[0] ||
								['image/jpeg', 'image/png', 'image/webp'].includes(v[0].type) ||
								'Only JPG, PNG, or WebP allowed',
						},
					})}
					error={errors.imageUrl?.message}
				/>
			</div>
		</div>
	)
}
