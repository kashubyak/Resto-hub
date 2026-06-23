'use client'

import { Z_INDEX } from '@/constants/ui.constant'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { memo, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	children: ReactNode
	maxWidth?: string
	className?: string
	panelClassName?: string
	align?: 'center' | 'end'
	disableClose?: boolean
	scrollable?: boolean
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
	scrollable = false,
	'aria-labelledby': ariaLabelledBy,
}: ModalProps) => {
	useBodyScrollLock(isOpen)

	if (!isOpen) return null
	if (typeof document === 'undefined') return null

	const handleClose = () => {
		if (!disableClose) onClose()
	}

	const alignClass =
		align === 'end'
			? 'items-end sm:items-center'
			: 'items-center justify-center'

	const modal = (
		<>
			<div
				className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-200"
				style={{ zIndex: Z_INDEX.modal }}
				onClick={handleClose}
				aria-hidden
			/>

			<div
				className={`fixed inset-0 flex ${alignClass} p-4 sm:p-6 pointer-events-none ${className}`}
				style={{ zIndex: Z_INDEX.modal }}
				role="dialog"
				aria-modal="true"
				aria-labelledby={ariaLabelledBy}
			>
				<div
					className={`relative w-full ${maxWidth} max-h-[calc(100dvh-2rem)] flex flex-col overflow-hidden bg-card border border-border rounded-xl shadow-2xl animate-in zoom-in-95 fade-in-0 slide-in-from-bottom-4 duration-300 pointer-events-auto ${panelClassName}`}
					onClick={(e) => e.stopPropagation()}
				>
					{scrollable ? (
						<div className="overflow-y-auto flex-1 min-h-0">{children}</div>
					) : (
						children
					)}
				</div>
			</div>
		</>
	)

	return createPortal(modal, document.body)
}

export const Modal = memo(ModalComponent)
