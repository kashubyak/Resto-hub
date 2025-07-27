'use client'

import type { InputHTMLAttributes } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

type AuthInputProps = {
	error?: string
	register: UseFormRegisterReturn
} & InputHTMLAttributes<HTMLInputElement>

export const AuthInput = ({ register, ...rest }: AuthInputProps) => {
	return (
		<div className='flex flex-col'>
			<input
				{...register}
				{...rest}
				className='border border-border rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring'
			/>
		</div>
	)
}
