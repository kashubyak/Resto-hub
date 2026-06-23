'use client'

import { useEffect } from 'react'

let lockCount = 0
let savedOverflow = ''

function lockBodyScroll() {
	if (typeof document === 'undefined') return

	if (lockCount === 0) savedOverflow = document.body.style.overflow

	lockCount += 1
	document.body.style.overflow = 'hidden'
}

function unlockBodyScroll() {
	if (typeof document === 'undefined') return

	lockCount = Math.max(0, lockCount - 1)

	if (lockCount === 0) document.body.style.overflow = savedOverflow
}

export function useBodyScrollLock(isOpen: boolean) {
	useEffect(() => {
		if (!isOpen) return

		lockBodyScroll()

		return () => {
			unlockBodyScroll()
		}
	}, [isOpen])
}
