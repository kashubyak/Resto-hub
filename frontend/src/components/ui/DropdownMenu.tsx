'use client'

import { memo, type ReactNode, useCallback } from 'react'
import { createPortal } from 'react-dom'

export interface IMenuItem {
	id: string
	label: string
	onClick: () => void
	disabled?: boolean
	className?: string
	isDivider?: boolean
	icon?: ReactNode
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

const MenuItem = memo<{
	item: IMenuItem
	onItemClick: (item: IMenuItem) => void
}>(({ item, onItemClick }) => {
	const handleClick = useCallback(() => {
		onItemClick(item)
	}, [item, onItemClick])

	if (item.isDivider) {
		return <div className='my-1 border-t border-border' />
	}

	return (
		<button
			onClick={handleClick}
			disabled={item.disabled}
			className={`w-full px-3 py-2 text-sm flex items-center justify-between hover:bg-secondary rounded-lg ${
				item.className || ''
			}`}
		>
			<span>{item.label}</span>
			{item.icon && <span className='ml-2 text-foreground'>{item.icon}</span>}
		</button>
	)
})

MenuItem.displayName = 'MenuItem'

export const DropdownMenu = memo<IDropdownMenuProps>(
	({ isOpen, position, menuRef, items, onClose, className = '' }) => {
		const handleItemClick = useCallback(
			(item: IMenuItem) => {
				if (!item.disabled) {
					item.onClick()
					onClose()
				}
			},
			[onClose],
		)

		if (!isOpen) return null

		const menuContent = (
			<div
				ref={menuRef}
				className={`fixed z-50 min-w-42 rounded-lg border border-border bg-secondary overflow-hidden ${className}`}
				style={{
					top: `${position.top}px`,
					left: `${position.left}px`,
				}}
			>
				<div className='p-1.5'>
					{items.map(item => (
						<MenuItem key={item.id} item={item} onItemClick={handleItemClick} />
					))}
				</div>
			</div>
		)

		return createPortal(menuContent, document.body)
	},
)

DropdownMenu.displayName = 'DropdownMenu'
