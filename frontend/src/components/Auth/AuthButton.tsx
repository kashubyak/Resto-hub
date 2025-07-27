'use client'

type AuthButtonProps = {
	type: 'submit' | 'button' | 'reset'
	text: string
}
export const AuthButton = ({ type, text }: AuthButtonProps) => {
	return (
		<button
			type={type}
			className='w-full bg-primary text-primary-foreground hover:bg-primary active:bg-active mt-2 py-2 px-4 rounded-md font-semibold'
		>
			{text}
		</button>
	)
}
