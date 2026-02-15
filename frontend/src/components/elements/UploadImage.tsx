'use client'

import { size_of_image } from '@/constants/share.constant'
import { useUploadImage } from '@/hooks/useUploadImage'
import { AlertCircle, Upload, X } from 'lucide-react'
import { memo, useCallback, useMemo, useState } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

type UploadImageProps = {
	label?: string
	error?: string
	register?: UseFormRegisterReturn
	savedPreview?: string | null
	onDataChange?: (preview: string | null, file: File | null) => void
}

export const UploadImage = memo(
	({ label, error, savedPreview, onDataChange, register }: UploadImageProps) => {
		const [isDraggingOver, setIsDraggingOver] = useState(false)

		const {
			preview,
			inputRef,
			handleDrop,
			preventDefaults,
			clearPreview,
			ref,
			isDragging: _isDragging,
			...restRegister
		} = useUploadImage({
			register: register!,
			savedPreview,
			onDataChange,
		})

		const currentPreview = useMemo(
			() => preview || savedPreview || null,
			[preview, savedPreview],
		)

		const handleClick = useCallback(() => inputRef.current?.click(), [inputRef])

		const inputRefCallback = useCallback(
			(e: HTMLInputElement | null) => {
				ref(e)
				inputRef.current = e
			},
			[ref, inputRef],
		)

		const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
			preventDefaults(e)
			setIsDraggingOver(true)
		}, [preventDefaults])

		const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
			preventDefaults(e)
			setIsDraggingOver(false)
		}, [preventDefaults])

		const handleDropZone = useCallback(
			(e: React.DragEvent<HTMLDivElement>) => {
				handleDrop(e)
				setIsDraggingOver(false)
			},
			[handleDrop],
		)

		return (
			<div className="space-y-2">
				{label && (
					<label className="block text-sm font-medium text-card-foreground">
						{label}
					</label>
				)}

				{!currentPreview ? (
					<div
						onClick={handleClick}
						onDragEnter={handleDragEnter}
						onDragOver={preventDefaults}
						onDragLeave={handleDragLeave}
						onDrop={handleDropZone}
						className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
							isDraggingOver
								? 'border-primary bg-primary/5'
								: error
									? 'border-red-500 bg-red-500/5'
									: 'border-border bg-muted/20 hover:border-primary hover:bg-primary/5'
						}`}
					>
						<div className="flex flex-col items-center gap-3">
							<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
								<Upload className="w-6 h-6 text-primary" />
							</div>
							<div>
								<p className="text-sm text-foreground font-medium mb-1">
									Click or drag & drop an image
								</p>
								<p className="text-xs text-muted-foreground">
									PNG, JPG up to {size_of_image}MB
								</p>
							</div>
						</div>

						<input
							ref={inputRefCallback}
							type="file"
							accept="image/*"
							{...restRegister}
							className="hidden"
						/>
					</div>
				) : (
					<div className="relative border-2 border-border rounded-xl p-4 bg-muted/20">
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
								<img
									src={currentPreview}
									alt="Preview"
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium text-foreground truncate">
									{label ?? 'Image'}
								</p>
								<p className="text-xs text-muted-foreground">
									Image uploaded
								</p>
							</div>
							<button
								type="button"
								onClick={clearPreview}
								className="w-8 h-8 rounded-lg bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center transition-colors flex-shrink-0"
							>
								<X className="w-4 h-4 text-destructive" />
							</button>
						</div>
					</div>
				)}

				{error && (
					<div className="flex items-center gap-1.5 text-red-500 mt-1">
						<AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
						<p className="text-xs">{error}</p>
					</div>
				)}
			</div>
		)
	},
)

UploadImage.displayName = 'UploadImage'
