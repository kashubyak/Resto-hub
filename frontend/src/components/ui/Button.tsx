'use client'

import { cn } from '@/utils/cn'

type ButtonProps = {
	type: 'submit' | 'button' | 'reset'
	onClick?: () => void
	text: string
	className?: string
}

export const Button = ({ type, text, onClick, className }: ButtonProps) => {
	return (
		<button
			type={type}
			onClick={onClick}
			className={cn(
				'w-full bg-primary text-primary-foreground hover:bg-primary mt-2 py-2 px-4 rounded-md font-semibold',
				className,
			)}
		>
			{text}
		</button>
	)
}
