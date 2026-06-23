'use client'

import { Z_INDEX } from '@/constants/ui.constant'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { memo, type ReactNode } from 'react'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	children: ReactNode
	maxWidth?: string
	className?: string
	panelClassName?: string
	align?: 'center' | 'end'
	disableClose?: boolean
	'aria-labelledby'?: string
}

const ModalComponent = ({
	isOpen,
	onClose,
	children,
	maxWidth = 'max-w-md',
	className = '',
	panelClassName = '',
	align = 'center',
	disableClose = false,
	'aria-labelledby': ariaLabelledBy,
}: ModalProps) => {
	useBodyScrollLock(isOpen)

	if (!isOpen) return null

	const handleClose = () => {
		if (!disableClose) onClose()
	}

	const alignClass =
		align === 'end'
			? 'items-end sm:items-center'
			: 'items-center justify-center'

	return (
		<div
			className={`fixed inset-0 flex ${alignClass} p-4 ${className}`}
			style={{ zIndex: Z_INDEX.modal }}
			role="dialog"
			aria-modal="true"
			aria-labelledby={ariaLabelledBy}
		>
			<div
				className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in-0 duration-200"
				onClick={handleClose}
				aria-hidden
			/>

			<div
				className={`relative w-full ${maxWidth} max-h-[100dvh] flex flex-col bg-card border border-border rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in-0 slide-in-from-bottom-4 duration-300 ${panelClassName}`}
				onClick={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</div>
	)
}

export const Modal = memo(ModalComponent)
