import { useCallback, useEffect, useRef, useState } from 'react'

interface Position {
	x: number
	y: number
}

interface UseImageViewerProps {
	open: boolean
	onClose: () => void
}

export const useImageViewer = ({ open, onClose }: UseImageViewerProps) => {
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

	const getCursor = () => {
		if (zoom <= 1) return 'default'
		if (isDragging) return 'grabbing'
		return 'grab'
	}

	const handleDoubleClick = zoom === 1 ? handleZoomIn : handleZoomOut

	return {
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
	}
}