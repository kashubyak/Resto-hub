'use client'

import { useViewableImage } from '@/hooks/useViewableImage'
import { Visibility as VisibilityIcon } from '@mui/icons-material'
import { Box, IconButton, useMediaQuery, useTheme } from '@mui/material'
import Image, { type ImageProps } from 'next/image'
import { memo, useCallback, useMemo } from 'react'
import { ImageViewer } from '../ImageViewer/ImageViewer'

interface ViewableImageProps extends Omit<ImageProps, 'src' | 'alt'> {
	src: string
	alt: string
	showViewIcon?: boolean
	onClick?: () => void
}

export const ViewableImage = memo(
	({
		src,
		alt,
		className,
		showViewIcon = false,
		onClick,
		style,
		...imageProps
	}: ViewableImageProps) => {
		const { isOpen, imageSrc, imageAlt, openViewer, closeViewer } =
			useViewableImage()
		const theme = useTheme()
		const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

		const isFill = useMemo(
			() => 'fill' in imageProps && imageProps.fill,
			[imageProps],
		)

		const handleImageClick = useCallback(() => {
			if (onClick) onClick()
			else openViewer(src, alt)
		}, [onClick, openViewer, src, alt])

		const handleViewIconClick = useCallback(
			(e: React.MouseEvent) => {
				e.preventDefault()
				e.stopPropagation()
				openViewer(src, alt)
			},
			[openViewer, src, alt],
		)

		const boxStyles = useMemo(
			() => ({
				position: 'relative' as const,
				display: 'inline-block' as const,
				cursor: 'pointer' as const,
				width: isFill ? '100%' : undefined,
				height: isFill ? '100%' : undefined,
				'&:hover .view-icon': {
					opacity: 1,
				},
			}),
			[isFill],
		)

		const iconButtonStyles = useMemo(
			() => ({
				position: 'absolute' as const,
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
			}),
			[isMobile],
		)

		return (
			<>
				<Box sx={boxStyles} onClick={handleImageClick}>
					<Image
						src={src}
						alt={alt}
						className={className}
						style={style}
						{...imageProps}
					/>

					{showViewIcon && (
						<IconButton
							className="view-icon"
							onClick={handleViewIconClick}
							sx={iconButtonStyles}
							size="small"
						>
							<VisibilityIcon fontSize="small" />
						</IconButton>
					)}
				</Box>

				<ImageViewer
					open={isOpen}
					onClose={closeViewer}
					src={imageSrc}
					alt={imageAlt}
				/>
			</>
		)
	},
)

ViewableImage.displayName = 'ViewableImage'
