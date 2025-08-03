'use client'

import { useUploadImage } from '@/hooks/useUploadImage'
import Image from 'next/image'
import type { UseFormRegisterReturn } from 'react-hook-form'

type UploadImageProps = {
	label?: string
	error?: string
	register: UseFormRegisterReturn
	savedPreview?: string | null
	onDataChange?: (preview: string | null, file: File | null) => void
}

export const UploadImage = ({
	label,
	error,
	savedPreview,
	onDataChange,
	...register
}: UploadImageProps) => {
	const {
		preview,
		isDragging,
		inputRef,
		handleDrop,
		preventDefaults,
		ref,
		...restRegister
	} = useUploadImage({ ...register, savedPreview, onDataChange })
	const currentPreview = preview || savedPreview

	return (
		<div className='flex flex-col gap-2 relative'>
			{label && <span className='text-sm font-medium text-foreground'>{label}</span>}
			{isDragging && (
				<div className='fixed inset-0 bg-[var(--background)]/30 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-auto'>
					<p className='text-foreground text-2xl font-semibold'>Drop image to upload</p>
				</div>
			)}
			{currentPreview ? (
				<div
					className='relative w-32 h-32 rounded-md overflow-hidden'
					onClick={() => inputRef.current?.click()}
				>
					<Image
						src={currentPreview}
						alt='Preview'
						fill
						className='object-cover cursor-pointer'
					/>
				</div>
			) : (
				<div
					onDrop={handleDrop}
					onDragOver={preventDefaults}
					onDragEnter={preventDefaults}
					onDragLeave={preventDefaults}
					onClick={() => inputRef.current?.click()}
					className='relative border-2 border-dashed border-[var(--muted-foreground)] p-6 rounded-md text-center cursor-pointer transition-colors hover:bg-muted/40'
				>
					<p className='text-muted-foreground'>Click or drag & drop an image</p>
				</div>
			)}

			<input
				type='file'
				accept='image/*'
				ref={e => {
					ref(e)
					inputRef.current = e
				}}
				{...restRegister}
				className='hidden'
			/>

			{error && <span className='text-destructive-foreground text-sm'>{error}</span>}
		</div>
	)
}
