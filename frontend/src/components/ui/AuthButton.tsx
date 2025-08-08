'use client'

type AuthButtonProps = {
	type: 'submit' | 'button' | 'reset'
	onClick?: () => void
	text: string
}
export const AuthButton = ({ type, text, onClick }: AuthButtonProps) => {
	return (
		<button
			type={type}
			onClick={onClick}
			className='w-full bg-primary text-primary-foreground hover:bg-primary active:bg-active mt-2 py-2 px-4 rounded-md font-semibold'
		>
			{text}
		</button>
	)
}
