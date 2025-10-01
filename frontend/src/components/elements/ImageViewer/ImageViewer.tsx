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

interface ImageViewerProps {
	open: boolean
	onClose: () => void
	src: string | null
	alt: string
}

export const ImageViewer = ({ open, onClose, src, alt }: ImageViewerProps) => {
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
				PaperProps={{
					sx: {
						backgroundColor: 'rgba(0, 0, 0, 0.95)',
						boxShadow: 'none',
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						zIndex: 9999,
						margin: 0,
						borderRadius: 0,
					},
				}}
				TransitionComponent={Zoom}
				transitionDuration={300}
				slotProps={{
					backdrop: {
						sx: {
							backgroundColor: 'rgba(0, 0, 0, 0.9)',
							zIndex: 9998,
						},
					},
				}}
			>
				<DialogContent
					ref={containerRef}
					sx={{
						p: 0,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						position: 'relative',
						overflow: 'hidden',
						backgroundColor: 'rgba(0, 0, 0, 0.9)',
						width: '100vw',
						height: '100vh',
						margin: 0,
						cursor: getCursor(),
						userSelect: 'none',
					}}
					onClick={handleBackdropClick}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleTouchEnd}
				>
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
							onClick={handleZoomOut}
							disabled={zoom <= 0.5}
							sx={{ color: 'white' }}
							size={isMobile ? 'small' : 'medium'}
						>
							<ZoomOutIcon />
						</IconButton>

						<IconButton
							onClick={handleZoomIn}
							disabled={zoom >= 3}
							sx={{ color: 'white' }}
							size={isMobile ? 'small' : 'medium'}
						>
							<ZoomInIcon />
						</IconButton>

						{!isMobile && (
							<IconButton
								onClick={handleFullscreen}
								sx={{ color: 'white' }}
								size={isMobile ? 'small' : 'medium'}
							>
								{isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
							</IconButton>
						)}

						<IconButton
							onClick={handleClose}
							sx={{ color: 'white' }}
							size={isMobile ? 'small' : 'medium'}
						>
							<CloseIcon />
						</IconButton>
					</Box>

					<Box
						ref={imageBoxRef}
						sx={{
							position: 'relative',
							maxWidth: '90vw',
							maxHeight: '90vh',
							transform: `scale(${zoom}) translate(${position.x / zoom}px, ${
								position.y / zoom
							}px)`,
							transition: isDragging ? 'none' : 'transform 0.2s ease-in-out',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
						onMouseDown={handleMouseDown}
						onTouchStart={handleTouchStart}
						onDoubleClick={handleDoubleClick}
					>
						<Image
							src={src}
							alt={alt}
							width={0}
							height={0}
							sizes='90vw'
							style={{
								width: 'auto',
								height: 'auto',
								maxWidth: '90vw',
								maxHeight: '90vh',
								objectFit: 'contain',
								pointerEvents: 'none',
							}}
							quality={100}
							priority
							draggable={false}
						/>
					</Box>

					{isMobile && zoom !== 1 && (
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
					)}
				</DialogContent>
			</Dialog>
		</Portal>
	)
}
