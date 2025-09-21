'use client'

import { useUploadImage } from '@/hooks/useUploadImage'
import { Box } from '@mui/material'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { ViewableImage } from '../ImageViewer/ViewableImage'

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
	const handleImageClick = () => inputRef.current?.click()

	return (
		<div className='flex flex-col gap-2 relative'>
			{label && <span className='text-sm font-medium text-foreground'>{label}</span>}
			{isDragging && (
				<div className='fixed inset-0 bg-[var(--background)]/30 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-auto'>
					<p className='text-foreground text-2xl font-semibold'>Drop image to upload</p>
				</div>
			)}
			{currentPreview ? (
				<Box sx={{ position: 'relative', display: 'inline-block' }}>
					<ViewableImage
						src={currentPreview}
						alt='Preview'
						width={128}
						height={128}
						className='object-cover cursor-pointer rounded-md'
						onClick={handleImageClick}
						showViewIcon
						style={{ width: '128px', height: '128px' }}
					/>
				</Box>
			) : (
				<div
					onDrop={handleDrop}
					onDragOver={preventDefaults}
					onDragEnter={preventDefaults}
					onDragLeave={preventDefaults}
					onClick={handleImageClick}
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
