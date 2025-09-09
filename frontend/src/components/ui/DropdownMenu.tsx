'use client'

import { type FC } from 'react'
import { createPortal } from 'react-dom'

export interface IMenuItem {
	id: string
	label: string
	onClick: () => void
	disabled?: boolean
	className?: string
	isDivider?: boolean
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
			className={`fixed z-50 min-w-42 rounded-lg border border-border bg-secondary overflow-hidden ${className}`}
			style={{
				top: position.top,
				left: position.left,
			}}
		>
			<div className='p-1.5'>
				{items.map(item =>
					item.isDivider ? (
						<div key={item.id} className='my-1 border-t border-border' />
					) : (
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
                w-full px-3 py-2 text-sm flex items-center gap-2
                hover: hover:bg-secondary hover:text-foreground rounded-lg
                ${item.className || ''}
              `}
						>
							{item.label}
						</button>
					),
				)}
			</div>
		</div>
	)

	return createPortal(menuContent, document.body)
}
