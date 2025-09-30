'use client'

import { useViewableImage } from '@/hooks/useViewableImage'
import { Visibility as VisibilityIcon } from '@mui/icons-material'
import { Box, IconButton, useMediaQuery, useTheme } from '@mui/material'
import Image, { type ImageProps } from 'next/image'
import { ImageViewer } from '../ImageViewer/ImageViewer'

interface ViewableImageProps extends Omit<ImageProps, 'src' | 'alt'> {
	src: string
	alt: string
	showViewIcon?: boolean
	onClick?: () => void
}

export const ViewableImage = ({
	src,
	alt,
	className,
	showViewIcon = false,
	onClick,
	style,
	...imageProps
}: ViewableImageProps) => {
	const { isOpen, imageSrc, imageAlt, openViewer, closeViewer } = useViewableImage()
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	const handleImageClick = () => {
		if (onClick) onClick()
		else openViewer(src, alt)
	}

	const handleViewIconClick = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		openViewer(src, alt)
	}

	const isFill = 'fill' in imageProps && imageProps.fill

	return (
		<>
			<Box
				sx={{
					position: 'relative',
					display: 'inline-block',
					cursor: 'pointer',
					width: isFill ? '100%' : undefined,
					height: isFill ? '100%' : undefined,
					'&:hover .view-icon': {
						opacity: 1,
					},
				}}
				onClick={handleImageClick}
			>
				<Image src={src} alt={alt} className={className} style={style} {...imageProps} />

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
							opacity: isMobile ? 1 : 0,
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
