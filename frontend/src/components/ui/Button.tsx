'use client'

import { cn } from '@/utils/cn'
import { memo, type ReactNode } from 'react'

type ButtonProps = {
	type?: 'submit' | 'button' | 'reset'
	onClick?: () => void
	text?: string
	children?: ReactNode
	className?: string
	disabled?: boolean
}

export const Button = memo<ButtonProps>(
	({ type = 'button', onClick, text, children, className, disabled }) => {
		return (
			<button
				type={type}
				onClick={onClick}
				disabled={disabled}
				className={cn(
					'w-full bg-primary text-primary-foreground hover:bg-primary mt-2 py-2 px-4 rounded-md font-semibold',
					className,
				)}
			>
				{children ?? text}
			</button>
		)
	},
)

Button.displayName = 'Button'
