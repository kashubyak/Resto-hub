'use client'

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
import { useCallback, useEffect, useRef, useState } from 'react'

interface ImageViewerProps {
	open: boolean
	onClose: () => void
	src: string | null
	alt: string
}

interface Position {
	x: number
	y: number
}

export const ImageViewer = ({ open, onClose, src, alt }: ImageViewerProps) => {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('md'))
	const [zoom, setZoom] = useState(1)
	const [isFullscreen, setIsFullscreen] = useState(false)
	const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
	const [isDragging, setIsDragging] = useState(false)
	const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 })
	const [initialPosition, setInitialPosition] = useState<Position>({ x: 0, y: 0 })

	const containerRef = useRef<HTMLDivElement>(null)
	const imageBoxRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (zoom === 1) setPosition({ x: 0, y: 0 })
	}, [zoom])

	useEffect(() => {
		if (!open) {
			setZoom(1)
			setPosition({ x: 0, y: 0 })
			setIsDragging(false)
		}
	}, [open])

	const handleZoomIn = useCallback(() => setZoom(prev => Math.min(prev * 1.2, 3)), [])
	const handleZoomOut = useCallback(() => setZoom(prev => Math.max(prev / 1.2, 0.5)), [])

	const handleFullscreen = useCallback(async () => {
		if (!containerRef.current) return

		try {
			if (!document.fullscreenElement) {
				await containerRef.current.requestFullscreen()
				setIsFullscreen(true)
			} else {
				await document.exitFullscreen()
				setIsFullscreen(false)
			}
		} catch (error) {
			console.error('Fullscreen error:', error)
		}
	}, [])

	const handleClose = useCallback(() => {
		setZoom(1)
		setPosition({ x: 0, y: 0 })
		setIsFullscreen(false)
		setIsDragging(false)
		onClose()
	}, [onClose])

	const handleBackdropClick = useCallback(
		(event: React.MouseEvent) => {
			if (event.target === event.currentTarget && !isDragging) handleClose()
		},
		[handleClose, isDragging],
	)

	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			if (zoom <= 1) return

			e.preventDefault()
			setIsDragging(true)
			setDragStart({ x: e.clientX, y: e.clientY })
			setInitialPosition(position)
		},
		[zoom, position],
	)

	const handleMouseMove = useCallback(
		(e: React.MouseEvent) => {
			if (!isDragging || zoom <= 1) return

			const deltaX = e.clientX - dragStart.x
			const deltaY = e.clientY - dragStart.y

			setPosition({
				x: initialPosition.x + deltaX,
				y: initialPosition.y + deltaY,
			})
		},
		[isDragging, zoom, dragStart, initialPosition],
	)

	const handleMouseUp = useCallback(() => setIsDragging(false), [])

	const handleTouchStart = useCallback(
		(e: React.TouchEvent) => {
			if (zoom <= 1 || e.touches.length !== 1) return

			const touch = e.touches[0]
			setIsDragging(true)
			setDragStart({ x: touch.clientX, y: touch.clientY })
			setInitialPosition(position)
		},
		[zoom, position],
	)

	const handleTouchMove = useCallback(
		(e: React.TouchEvent) => {
			if (!isDragging || zoom <= 1 || e.touches.length !== 1) return

			e.preventDefault()
			const touch = e.touches[0]
			const deltaX = touch.clientX - dragStart.x
			const deltaY = touch.clientY - dragStart.y

			setPosition({
				x: initialPosition.x + deltaX,
				y: initialPosition.y + deltaY,
			})
		},
		[isDragging, zoom, dragStart, initialPosition],
	)

	const handleTouchEnd = useCallback(() => setIsDragging(false), [])

	useEffect(() => {
		if (isDragging) {
			const handleGlobalMouseMove = (e: MouseEvent) => {
				const deltaX = e.clientX - dragStart.x
				const deltaY = e.clientY - dragStart.y

				setPosition({
					x: initialPosition.x + deltaX,
					y: initialPosition.y + deltaY,
				})
			}

			const handleGlobalMouseUp = () => setIsDragging(false)

			document.addEventListener('mousemove', handleGlobalMouseMove)
			document.addEventListener('mouseup', handleGlobalMouseUp)

			return () => {
				document.removeEventListener('mousemove', handleGlobalMouseMove)
				document.removeEventListener('mouseup', handleGlobalMouseUp)
			}
		}
	}, [isDragging, dragStart, initialPosition])

	if (!src) return null

	const getCursor = () => {
		if (zoom <= 1) return 'default'
		if (isDragging) return 'grabbing'
		return 'grab'
	}

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
						onDoubleClick={zoom === 1 ? handleZoomIn : handleZoomOut}
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
