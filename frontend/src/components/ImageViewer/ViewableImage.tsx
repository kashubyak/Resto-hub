'use client'

import { useImageViewer } from '@/hooks/useImageViewer'
import { Visibility as VisibilityIcon } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import Image from 'next/image'
import { ImageViewer } from '../ImageViewer/ImageViewer'

interface ViewableImageProps {
	src: string
	alt: string
	width?: number
	height?: number
	className?: string
	showViewIcon?: boolean
	onClick?: () => void
	style?: React.CSSProperties
}

export const ViewableImage = ({
	src,
	alt,
	width,
	height,
	className,
	showViewIcon = false,
	onClick,
	style,
}: ViewableImageProps) => {
	const { isOpen, imageSrc, imageAlt, openViewer, closeViewer } = useImageViewer()

	const handleImageClick = () => {
		if (onClick) onClick()
		else openViewer(src, alt)
	}

	const handleViewIconClick = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		openViewer(src, alt)
	}

	return (
		<>
			<Box
				sx={{
					position: 'relative',
					display: 'inline-block',
					cursor: 'pointer',
					'&:hover .view-icon': {
						opacity: 1,
					},
				}}
				onClick={handleImageClick}
			>
				<Image
					src={src}
					alt={alt}
					width={width}
					height={height}
					className={className}
					style={style}
				/>

				{showViewIcon && (
					<IconButton
						className='view-icon'
						onClick={handleViewIconClick}
						sx={{
							position: 'absolute',
							top: 8,
							right: 8,
							backgroundColor: 'rgba(0, 0, 0, 0.5)',
							color: 'white',
							opacity: 0,
							transition: 'opacity 0.2s ease-in-out',
							'&:hover': {
								backgroundColor: 'rgba(0, 0, 0, 0.7)',
								opacity: '1 !important',
							},
						}}
						size='small'
					>
						<VisibilityIcon fontSize='small' />
					</IconButton>
				)}
			</Box>

			<ImageViewer open={isOpen} onClose={closeViewer} src={imageSrc} alt={imageAlt} />
		</>
	)
}
