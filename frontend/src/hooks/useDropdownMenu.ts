'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface IPosition {
	top: number
	left: number
}

export const useKebabMenu = (offset = 8, margin = 8) => {
	const [isOpen, setIsOpen] = useState(false)
	const [position, setPosition] = useState<IPosition>({ top: 0, left: 0 })

	const menuRef = useRef<HTMLDivElement | null>(null)
	const buttonRef = useRef<HTMLButtonElement | null>(null)
	const anchorRectRef = useRef<DOMRect | null>(null)

	const closeMenu = useCallback(() => setIsOpen(false), [])

	const openMenu = useCallback(() => {
		const btn = buttonRef.current
		if (!btn) return

		const rect = btn.getBoundingClientRect()
		anchorRectRef.current = rect

		setPosition({
			top: Math.round(rect.bottom + offset),
			left: Math.round(rect.left),
		})
		setIsOpen(true)
	}, [offset])

	const toggleMenu = useCallback(() => {
		if (isOpen) closeMenu()
		else openMenu()
	}, [isOpen, openMenu, closeMenu])

	useEffect(() => {
		if (!isOpen) return

		const adjustPosition = () => {
			const anchor = anchorRectRef.current
			const menu = menuRef.current
			if (!anchor || !menu) return

			const menuRect = menu.getBoundingClientRect()
			let left = anchor.left
			let top = anchor.bottom + offset

			if (
				top + menuRect.height > window.innerHeight - margin &&
				anchor.top > menuRect.height + margin
			)
				top = anchor.top - menuRect.height - offset

			if (left + menuRect.width > window.innerWidth - margin) {
				const candidateLeft = anchor.right - menuRect.width
				left = Math.max(margin, candidateLeft)
			}

			if (left < margin) left = margin
			setPosition({ top: Math.round(top), left: Math.round(left) })
		}

		const raf = requestAnimationFrame(adjustPosition)

		const handleResize = () => adjustPosition()
		window.addEventListener('resize', handleResize)
		window.addEventListener('scroll', handleResize, true)

		return () => {
			cancelAnimationFrame(raf)
			window.removeEventListener('resize', handleResize)
			window.removeEventListener('scroll', handleResize, true)
		}
	}, [isOpen, offset, margin])

	useEffect(() => {
		if (!isOpen) return

		const handleDocumentClick = (e: Event) => {
			const target = e.target as Node | null
			if (!menuRef.current || !buttonRef.current) return
			if (!menuRef.current.contains(target) && !buttonRef.current.contains(target))
				closeMenu()
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') closeMenu()
		}

		document.addEventListener('mousedown', handleDocumentClick)
		document.addEventListener('touchstart', handleDocumentClick)
		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('mousedown', handleDocumentClick)
			document.removeEventListener('touchstart', handleDocumentClick)
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [isOpen, closeMenu])

	return {
		isOpen,
		position,
		openMenu,
		closeMenu,
		toggleMenu,
		menuRef,
		buttonRef,
	}
}
