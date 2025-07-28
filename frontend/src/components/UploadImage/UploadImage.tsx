'use client'

import { useUploadImage } from '@/hooks/useUploadImage'
import Image from 'next/image'
import type { UseFormRegisterReturn } from 'react-hook-form'

type UploadImageProps = {
	label?: string
	error?: string
	register: UseFormRegisterReturn
}

export const UploadImage = ({ label, error, register }: UploadImageProps) => {
	const {
		preview,
		isDragging,
		inputRef,
		handleDrop,
		preventDefaults,
		ref,
		...restRegister
	} = useUploadImage(register)
	return (
		<div className='flex flex-col gap-2 relative'>
			{label && <span className='text-sm font-medium text-foreground'>{label}</span>}

			{isDragging && (
				<div className='fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-auto'>
					<p className='text-white text-lg font-semibold'>Drop image to upload</p>
				</div>
			)}

			{preview ? (
				<div
					className='relative w-32 h-32 mx-auto rounded-md overflow-hidden'
					onClick={() => inputRef.current?.click()}
				>
					<Image
						src={preview}
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
					className='relative border-2 border-dashed border-muted p-6 rounded-md text-center cursor-pointer transition-colors hover:bg-muted/40'
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

			{error && <span className='text-red-500 text-sm'>{error}</span>}
		</div>
	)
}
