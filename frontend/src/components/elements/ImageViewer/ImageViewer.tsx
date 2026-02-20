'use client'

import { useImageViewer } from '@/hooks/useImageViewer'
import {
	Close as CloseIcon,
	FullscreenExit as FullscreenExitIcon,
	Fullscreen as FullscreenIcon,
	ZoomIn as ZoomInIcon,
	ZoomOut as ZoomOutIcon,
} from '@mui/icons-material'
import {
	Box,
	Dialog,
	DialogContent,
	IconButton,
	Portal,
	Zoom,
	useMediaQuery,
	useTheme,
} from '@mui/material'
import Image from 'next/image'
import { memo, useMemo } from 'react'

interface ImageViewerProps {
	open: boolean
	onClose: () => void
	src: string | null
	alt: string
}

const ControlPanel = memo(
	({
		zoom,
		isMobile,
		isFullscreen,
		onZoomIn,
		onZoomOut,
		onFullscreen,
		onClose,
	}: {
		zoom: number
		isMobile: boolean
		isFullscreen: boolean
		onZoomIn: () => void
		onZoomOut: () => void
		onFullscreen: () => void
		onClose: () => void
	}) => (
		<Box
			sx={{
				position: 'fixed',
				top: 16,
				right: 16,
				display: 'flex',
				gap: 1,
				zIndex: 1,
				backgroundColor: 'rgba(0, 0, 0, 0.5)',
				borderRadius: 2,
				p: 1,
			}}
		>
			<IconButton
				onClick={onZoomOut}
				disabled={zoom <= 0.5}
				sx={{ color: 'white' }}
				size={isMobile ? 'small' : 'medium'}
			>
				<ZoomOutIcon />
			</IconButton>

			<IconButton
				onClick={onZoomIn}
				disabled={zoom >= 3}
				sx={{ color: 'white' }}
				size={isMobile ? 'small' : 'medium'}
			>
				<ZoomInIcon />
			</IconButton>

			{!isMobile && (
				<IconButton
					onClick={onFullscreen}
					sx={{ color: 'white' }}
					size={isMobile ? 'small' : 'medium'}
				>
					{isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
				</IconButton>
			)}

			<IconButton
				onClick={onClose}
				sx={{ color: 'white' }}
				size={isMobile ? 'small' : 'medium'}
			>
				<CloseIcon />
			</IconButton>
		</Box>
	),
)
ControlPanel.displayName = 'ControlPanel'

const ZoomIndicator = memo(({ zoom }: { zoom: number }) => (
	<Box
		sx={{
			position: 'fixed',
			bottom: 16,
			left: '50%',
			transform: 'translateX(-50%)',
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
			color: 'white',
			px: 2,
			py: 1,
			borderRadius: 1,
			fontSize: '0.875rem',
		}}
	>
		{Math.round(zoom * 100)}%
	</Box>
))
ZoomIndicator.displayName = 'ZoomIndicator'

export const ImageViewer = memo(
	({ open, onClose, src, alt }: ImageViewerProps) => {
		const theme = useTheme()
		const isMobile = useMediaQuery(theme.breakpoints.down('md'))

		const {
			zoom,
			isFullscreen,
			position,
			isDragging,
			containerRef,
			imageBoxRef,
			handleZoomIn,
			handleZoomOut,
			handleFullscreen,
			handleClose,
			handleBackdropClick,
			handleMouseDown,
			handleMouseMove,
			handleMouseUp,
			handleTouchStart,
			handleTouchMove,
			handleTouchEnd,
			handleDoubleClick,
			getCursor,
		} = useImageViewer({ open, onClose })

		const paperProps = useMemo(
			() => ({
				sx: {
					backgroundColor: 'rgba(0, 0, 0, 0.95)',
					boxShadow: 'none',
					position: 'fixed' as const,
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: 9999,
					margin: 0,
					borderRadius: 0,
				},
			}),
			[],
		)

		const backdropProps = useMemo(
			() => ({
				backdrop: {
					sx: {
						backgroundColor: 'rgba(0, 0, 0, 0.9)',
						zIndex: 9998,
					},
				},
			}),
			[],
		)

		const contentStyles = useMemo(
			() => ({
				p: 0,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				position: 'relative' as const,
				overflow: 'hidden',
				backgroundColor: 'rgba(0, 0, 0, 0.9)',
				width: '100vw',
				height: '100vh',
				margin: 0,
				cursor: getCursor(),
				userSelect: 'none' as const,
			}),
			[getCursor],
		)

		const imageBoxStyles = useMemo(
			() => ({
				position: 'relative' as const,
				maxWidth: '90vw',
				maxHeight: '90vh',
				transform: `scale(${zoom}) translate(${position.x / zoom}px, ${
					position.y / zoom
				}px)`,
				transition: isDragging ? 'none' : 'transform 0.2s ease-in-out',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}),
			[zoom, position.x, position.y, isDragging],
		)

		const imageStyles = useMemo(
			() => ({
				width: 'auto',
				height: 'auto',
				maxWidth: '90vw',
				maxHeight: '90vh',
				objectFit: 'contain' as const,
				pointerEvents: 'none' as const,
			}),
			[],
		)

		if (!src) return null

		return (
			<Portal>
				<Dialog
					open={open}
					onClose={handleClose}
					maxWidth={false}
					fullWidth
					fullScreen
					disablePortal={false}
					keepMounted={false}
					PaperProps={paperProps}
					TransitionComponent={Zoom}
					transitionDuration={300}
					slotProps={backdropProps}
				>
					<DialogContent
						ref={containerRef}
						sx={contentStyles}
						onClick={handleBackdropClick}
						onMouseMove={handleMouseMove}
						onMouseUp={handleMouseUp}
						onTouchMove={handleTouchMove}
						onTouchEnd={handleTouchEnd}
					>
						<ControlPanel
							zoom={zoom}
							isMobile={isMobile}
							isFullscreen={isFullscreen}
							onZoomIn={handleZoomIn}
							onZoomOut={handleZoomOut}
							onFullscreen={handleFullscreen}
							onClose={handleClose}
						/>

						<Box
							ref={imageBoxRef}
							sx={imageBoxStyles}
							onMouseDown={handleMouseDown}
							onTouchStart={handleTouchStart}
							onDoubleClick={handleDoubleClick}
						>
							<Image
								src={src}
								alt={alt}
								width={0}
								height={0}
								sizes="90vw"
								style={imageStyles}
								quality={100}
								priority
								draggable={false}
							/>
						</Box>

						{isMobile && zoom !== 1 && <ZoomIndicator zoom={zoom} />}
					</DialogContent>
				</Dialog>
			</Portal>
		)
	},
)

ImageViewer.displayName = 'ImageViewer'
