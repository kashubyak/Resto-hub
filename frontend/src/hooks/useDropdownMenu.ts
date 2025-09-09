'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface IPosition {
	top: number
	left: number
}

export const useDropdownMenu = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [position, setPosition] = useState<IPosition>({ top: 0, left: 0 })
	const menuRef = useRef<HTMLDivElement>(null)
	const buttonRef = useRef<HTMLButtonElement>(null)

	const openMenu = useCallback(() => setIsOpen(true), [])
	const closeMenu = useCallback(() => setIsOpen(false), [])
	const toggleMenu = useCallback(() => setIsOpen(prev => !prev), [])

	const calculatePosition = useCallback(() => {
		if (!buttonRef.current) return

		const buttonRect = buttonRef.current.getBoundingClientRect()
		const menuHeight = 200
		const menuWidth = 200
		const viewportHeight = window.innerHeight
		const viewportWidth = window.innerWidth

		const spaceBelow = viewportHeight - buttonRect.bottom
		const spaceAbove = buttonRect.top

		let top = buttonRect.bottom + window.scrollY + 4
		let left = buttonRect.left + window.scrollX

		if (spaceBelow < menuHeight && spaceAbove > menuHeight)
			top = buttonRect.top + window.scrollY - menuHeight - 4

		if (left + menuWidth > viewportWidth)
			left = buttonRect.right + window.scrollX - menuWidth

		if (left < 0) left = 4

		setPosition({ top, left })
	}, [])

	useEffect(() => {
		if (isOpen) {
			calculatePosition()

			const handleResize = () => calculatePosition()
			window.addEventListener('resize', handleResize)

			return () => window.removeEventListener('resize', handleResize)
		}
	}, [isOpen, calculatePosition])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node)
			)
				closeMenu()
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside)
			return () => document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isOpen, closeMenu])

	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') closeMenu()
		}

		if (isOpen) {
			document.addEventListener('keydown', handleEscape)
			return () => document.removeEventListener('keydown', handleEscape)
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
