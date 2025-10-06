'use client'

import { useUploadImage } from '@/hooks/useUploadImage'
import { Box } from '@mui/material'
import { memo, useCallback, useMemo } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { ViewableImage } from './ImageViewer/ViewableImage'

type UploadImageProps = {
	label?: string
	error?: string
	register: UseFormRegisterReturn
	savedPreview?: string | null
	onDataChange?: (preview: string | null, file: File | null) => void
}

const DragOverlay = memo(() => (
	<div className='fixed inset-0 bg-[var(--background-rgb)]/30 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-auto'>
		<p className='text-foreground text-2xl font-semibold'>Drop image to upload</p>
	</div>
))
DragOverlay.displayName = 'DragOverlay'

const UploadPlaceholder = memo(
	({
		onClick,
		onDrop,
		preventDefaults,
	}: {
		onClick: () => void
		onDrop: (e: React.DragEvent<HTMLDivElement>) => void
		preventDefaults: (e: React.DragEvent<HTMLDivElement>) => void
	}) => (
		<div
			onDrop={onDrop}
			onDragOver={preventDefaults}
			onDragEnter={preventDefaults}
			onDragLeave={preventDefaults}
			onClick={onClick}
			className='relative border-2 border-dashed border-[var(--muted-foreground)] p-6 rounded-md text-center cursor-pointer transition-colors hover:bg-muted/40'
		>
			<p className='text-muted-foreground'>Click or drag & drop an image</p>
		</div>
	),
)
UploadPlaceholder.displayName = 'UploadPlaceholder'

const ImagePreview = memo(({ src, onClick }: { src: string; onClick: () => void }) => (
	<Box sx={{ position: 'relative', display: 'inline-block' }}>
		<ViewableImage
			src={src}
			alt='Preview'
			width={128}
			height={128}
			className='object-cover cursor-pointer rounded-md'
			onClick={onClick}
			showViewIcon
			style={{ width: '128px', height: '128px' }}
		/>
	</Box>
))
ImagePreview.displayName = 'ImagePreview'

export const UploadImage = memo(
	({ label, error, savedPreview, onDataChange, ...register }: UploadImageProps) => {
		const {
			preview,
			isDragging,
			inputRef,
			handleDrop,
			preventDefaults,
			ref,
			...restRegister
		} = useUploadImage({ ...register, savedPreview, onDataChange })

		const currentPreview = useMemo(() => preview || savedPreview, [preview, savedPreview])
		const handleImageClick = useCallback(() => inputRef.current?.click(), [inputRef])

		const inputRefCallback = useCallback(
			(e: HTMLInputElement | null) => {
				ref(e)
				inputRef.current = e
			},
			[ref, inputRef],
		)

		return (
			<div className='flex flex-col gap-2 relative'>
				{label && <span className='text-sm font-medium text-foreground'>{label}</span>}
				{isDragging && <DragOverlay />}
				{currentPreview ? (
					<ImagePreview src={currentPreview} onClick={handleImageClick} />
				) : (
					<UploadPlaceholder
						onClick={handleImageClick}
						onDrop={handleDrop}
						preventDefaults={preventDefaults}
					/>
				)}

				<input
					type='file'
					accept='image/*'
					ref={inputRefCallback}
					{...restRegister}
					className='hidden'
				/>

				{error && <span className='text-[var(--destructive)] text-sm'>{error}</span>}
			</div>
		)
	},
)

UploadImage.displayName = 'UploadImage'
