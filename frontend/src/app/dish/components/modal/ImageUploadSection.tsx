'use client'

import { UploadImage } from '@/components/elements/UploadImage'
import { size_of_image } from '@/constants/share.constant'
import type { IDishFormValues } from '@/types/dish.interface'
import { imageValidation } from '@/validation/dish.validation'
import { Image as ImageIcon, Upload } from 'lucide-react'
import Image from 'next/image'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
	Controller,
	type ChangeHandler,
	type Control,
	type ControllerRenderProps,
	type FieldErrors,
	type UseFormRegister,
	type UseFormRegisterReturn,
} from 'react-hook-form'

interface ImageUploadUpdateContentProps {
	field: ControllerRenderProps<IDishFormValues, 'imageUrl'>
	currentImageUrl: string | null
	errorMessage?: string
}

const ImageUploadUpdateContent = memo(
	({ field, currentImageUrl, errorMessage }: ImageUploadUpdateContentProps) => {
		const fileInputRef = useRef<HTMLInputElement>(null)
		const [isDraggingOver, setIsDraggingOver] = useState(false)
		const objectUrlRef = useRef<string | null>(null)

		const previewUrl = useMemo(() => {
			const v = field.value
			if (v instanceof File) {
				if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
				objectUrlRef.current = URL.createObjectURL(v)
				return objectUrlRef.current
			}
			if (typeof v === 'string' && v) return v
			return currentImageUrl
		}, [field.value, currentImageUrl])

		useEffect(
			() => () => {
				if (objectUrlRef.current) {
					URL.revokeObjectURL(objectUrlRef.current)
					objectUrlRef.current = null
				}
			},
			[],
		)

		const handleInputChange: ChangeHandler = useCallback(
			(e) => {
				const file = (e?.target as HTMLInputElement)?.files?.[0]
				if (
					file &&
					file.type.startsWith('image/') &&
					file.size <= size_of_image * 1024 * 1024
				) {
					field.onChange(file)
				}
				return Promise.resolve()
			},
			[field],
		)

		const handleRemove = useCallback(() => {
			field.onChange('')
			if (fileInputRef.current) {
				fileInputRef.current.value = ''
				fileInputRef.current.files = null
			}
			if (objectUrlRef.current) {
				URL.revokeObjectURL(objectUrlRef.current)
				objectUrlRef.current = null
			}
		}, [field])

		const handleDrop = useCallback(
			(e: React.DragEvent) => {
				e.preventDefault()
				setIsDraggingOver(false)
				const file = e.dataTransfer.files?.[0]
				if (
					file &&
					file.type.startsWith('image/') &&
					file.size <= size_of_image * 1024 * 1024
				)
					field.onChange(file)
			},
			[field],
		)

		if (!previewUrl) {
			return (
				<>
					<div
						onClick={() => fileInputRef.current?.click()}
						onDrop={handleDrop}
						onDragOver={(e) => {
							e.preventDefault()
							setIsDraggingOver(true)
						}}
						onDragLeave={(e) => {
							e.preventDefault()
							setIsDraggingOver(false)
						}}
						className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer hover:border-primary ${
							isDraggingOver ? 'border-primary bg-primary/5' : 'border-border'
						}`}
					>
						<Upload className="w-8 h-8 text-primary mx-auto mb-3" />
						<p className="text-sm font-medium text-foreground mb-1">
							Click or drag image here
						</p>
						<p className="text-xs text-muted-foreground">
							PNG, JPG up to {size_of_image}MB
						</p>
					</div>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						onChange={(e) => {
							void handleInputChange(e)
						}}
						className="hidden"
					/>
					{errorMessage && (
						<p className="text-sm text-[var(--destructive)] mt-1">
							{errorMessage}
						</p>
					)}
				</>
			)
		}

		return (
			<>
				<div className="relative group w-full h-48">
					<Image
						src={previewUrl ?? ''}
						alt="Dish"
						fill
						className="object-cover rounded-xl"
					/>
					<div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-white/90"
						>
							Change
						</button>
						<button
							type="button"
							onClick={handleRemove}
							className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
						>
							Remove
						</button>
					</div>
				</div>
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					onChange={(e) => {
						void handleInputChange(e)
					}}
					className="hidden"
				/>
				{errorMessage && (
					<p className="text-sm text-[var(--destructive)] mt-1">
						{errorMessage}
					</p>
				)}
			</>
		)
	},
)
ImageUploadUpdateContent.displayName = 'ImageUploadUpdateContent'

interface ImageUploadSectionProps {
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
			if (onChangeOutside) onChangeOutside(file ?? preview ?? '')
		},
		[onChangeOutside],
	)

	const validationRules = useMemo(
		() => (mode === 'update' ? {} : imageValidation),
		[mode],
	)

	if (control && mode === 'update') {
		return (
			<div className="space-y-4">
				<div className="flex items-center gap-2 text-sm font-semibold text-foreground">
					<ImageIcon className="w-4 h-4 text-primary" />
					Dish Image
				</div>
				<Controller
					name="imageUrl"
					control={control}
					rules={validationRules}
					render={({ field }) => (
						<ImageUploadUpdateContent
							field={field}
							currentImageUrl={currentImageUrl}
							errorMessage={errors?.imageUrl?.message}
						/>
					)}
				/>
			</div>
		)
	}

	if (control) {
		return (
			<div className="mb-6">
				<h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
					📸 Dish Image
				</h3>
				<div className="rounded-lg p-4 border border-border">
					<Controller
						name="imageUrl"
						control={control}
						rules={validationRules}
						render={({ field }) => {
							const { onChange, onBlur, ref, name } = field

							const handleDataChange = (
								preview: string | null,
								file: File | null,
							) => {
								if (file) {
									onChange(file)
								} else {
									onChange(preview ?? '')
								}
							}

							const handleInputChange: ChangeHandler = (e) => {
								const file = (e?.target as HTMLInputElement)?.files?.[0]
								onChange(file ?? '')
								return Promise.resolve()
							}

							return (
								<UploadImage
									label="Upload dish image"
									error={errors?.imageUrl?.message}
									savedPreview={
										mode === 'update' ? (currentImageUrl ?? null) : null
									}
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
						<p className="text-xs text-muted-foreground mt-2">
							💡 Leave empty to keep current image
						</p>
					)}
				</div>
			</div>
		)
	}

	return (
		<div className="mb-6">
			<h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
				📸 Dish Image
			</h3>
			<div className="rounded-lg p-4 border border-border">
				<UploadImage
					label="Upload dish image"
					error={errors?.imageUrl?.message}
					savedPreview={mode === 'update' ? (currentImageUrl ?? null) : null}
					onDataChange={handleStandaloneChange}
					register={registerForImage}
				/>
			</div>
		</div>
	)
}

export const ImageUploadSection = memo(ImageUploadSectionFunction)
