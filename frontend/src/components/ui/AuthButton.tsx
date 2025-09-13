'use client'

import { cn } from '@/utils/cn'

type AuthButtonProps = {
	type: 'submit' | 'button' | 'reset'
	onClick?: () => void
	text: string
	className?: string
}

export const AuthButton = ({ type, text, onClick, className }: AuthButtonProps) => {
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
