'use client'

import type { InputHTMLAttributes } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

type AuthInputProps = {
	error?: string
	register?: UseFormRegisterReturn
} & InputHTMLAttributes<HTMLInputElement>

export const AuthInput = ({ register, error, ...rest }: AuthInputProps) => {
	return (
		<div className='flex flex-col'>
			<input
				{...register}
				{...rest}
				className={`border rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
					error ? 'border-red-500' : 'border-border'
				}`}
			/>
			{error && <span className='text-red-500 text-sm mt-1'>{error}</span>}
		</div>
	)
}
