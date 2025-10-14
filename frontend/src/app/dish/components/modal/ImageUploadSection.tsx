'use client'

import { UploadImage } from '@/components/elements/UploadImage'
import type { IDishFormValues } from '@/types/dish.interface'
import { imageValidation } from '@/validation/dish.validation'
import { memo, useCallback, useMemo } from 'react'
import {
	Controller,
	type ChangeHandler,
	type Control,
	type FieldErrors,
	type UseFormRegister,
	type UseFormRegisterReturn,
} from 'react-hook-form'

type ImageUploadSectionProps = {
	control?: Control<IDishFormValues> | null
	register?: UseFormRegister<IDishFormValues>
	errors?: FieldErrors<IDishFormValues>
	mode?: 'create' | 'update'
	currentImageUrl?: string | null
	onChangeOutside?: (fileOrUrl: File | string) => void
}

const ImageUploadSectionFunction = ({
	control,
	register,
	errors = {},
	mode = 'create',
	currentImageUrl = null,
	onChangeOutside,
}: ImageUploadSectionProps) => {
	const registerForImage: UseFormRegisterReturn | undefined = register
		? register('imageUrl')
		: undefined

	const handleStandaloneChange = useCallback(
		(preview: string | null, file: File | null) => {
			if (onChangeOutside) onChangeOutside(file ?? (preview || ''))
		},
		[onChangeOutside],
	)

	const validationRules = useMemo(
		() => (mode === 'update' ? {} : imageValidation),
		[mode],
	)

	if (control) {
		return (
			<div className='mb-6'>
				<h3 className='text-lg font-semibold mb-4 text-foreground flex items-center gap-2'>
					📸 Dish Image
				</h3>
				<div className='rounded-lg p-4 border border-border'>
					<Controller
						name='imageUrl'
						control={control}
						rules={validationRules}
						render={({ field }) => {
							const { onChange, onBlur, ref, name } = field

							const handleDataChange = (preview: string | null, file: File | null) => {
								if (file) onChange(file)
								else onChange(preview || '')
							}

							const handleInputChange: ChangeHandler = async e => {
								const file = (e?.target as HTMLInputElement)?.files?.[0]
								onChange(file ?? '')
							}

							return (
								<UploadImage
									label='Upload dish image'
									error={errors?.imageUrl?.message}
									savedPreview={mode === 'update' ? currentImageUrl ?? null : null}
									onDataChange={handleDataChange}
									register={{
										name,
										ref,
										onChange: handleInputChange,
										onBlur: onBlur as unknown as ChangeHandler,
									}}
								/>
							)
						}}
					/>
					{mode === 'update' && currentImageUrl && (
						<p className='text-xs text-muted-foreground mt-2'>
							💡 Leave empty to keep current image
						</p>
					)}
				</div>
			</div>
		)
	}

	return (
		<div className='mb-6'>
			<h3 className='text-lg font-semibold mb-4 text-foreground flex items-center gap-2'>
				📸 Dish Image
			</h3>
			<div className='rounded-lg p-4 border border-border'>
				<UploadImage
					label='Upload dish image'
					error={errors?.imageUrl?.message}
					savedPreview={mode === 'update' ? currentImageUrl ?? null : null}
					onDataChange={handleStandaloneChange}
					register={registerForImage}
				/>
			</div>
		</div>
	)
}

export const ImageUploadSection = memo(ImageUploadSectionFunction)
