'use client'

import { type FC } from 'react'
import { createPortal } from 'react-dom'

export interface IMenuItem {
	id: string
	label: string
	onClick: () => void
	disabled?: boolean
	className?: string
}

interface IPosition {
	top: number
	left: number
}

interface IDropdownMenuProps {
	isOpen: boolean
	position: IPosition
	menuRef: React.RefObject<HTMLDivElement | null>
	items: IMenuItem[]
	onClose: () => void
	className?: string
}

export const DropdownMenu: FC<IDropdownMenuProps> = ({
	isOpen,
	position,
	menuRef,
	items,
	onClose,
	className = '',
}) => {
	if (!isOpen) return null

	const menuContent = (
		<div
			ref={menuRef}
			className={`fixed z-50 min-w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 ${className}`}
			style={{
				top: position.top,
				left: position.left,
			}}
		>
			{items.map(item => (
				<button
					key={item.id}
					onClick={() => {
						if (!item.disabled) {
							item.onClick()
							onClose()
						}
					}}
					disabled={item.disabled}
					className={`
            w-full text-left px-4 py-2 text-sm text-gray-700 
            hover:bg-gray-100 hover:text-gray-900 
            disabled:opacity-50 disabled:cursor-not-allowed
            first:rounded-t-lg last:rounded-b-lg
            transition-colors duration-150
            ${item.className || ''}
          `}
				>
					{item.label}
				</button>
			))}
		</div>
	)

	return createPortal(menuContent, document.body)
}
