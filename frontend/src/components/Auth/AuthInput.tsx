'use client'

import { Visibility, VisibilityOff } from '@mui/icons-material'
import type { InputHTMLAttributes } from 'react'
import { useState } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

type AuthInputProps = {
	error?: string
	register?: UseFormRegisterReturn
	rest: InputHTMLAttributes<HTMLInputElement>
	type: 'text' | 'email' | 'password' | 'number'
} & InputHTMLAttributes<HTMLInputElement>

export const AuthInput = ({ register, error, type, ...rest }: AuthInputProps) => {
	const [showPassword, setShowPassword] = useState(false)
	const isPasswordField = type === 'password'
	const togglePasswordVisibility = () => setShowPassword(!showPassword)
	const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type

	return (
		<div className='flex flex-col'>
			<div className='relative'>
				<input
					{...register}
					{...rest}
					type={inputType}
					className={`w-full border rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
						error ? 'border-red-500' : 'border-border'
					} ${isPasswordField ? 'pr-10' : ''}`}
				/>
				{isPasswordField && (
					<button
						type='button'
						onClick={togglePasswordVisibility}
						className='absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground hover:text-[var(--muted-foreground)] focus:outline-none'
						tabIndex={-1}
					>
						{showPassword ? (
							<VisibilityOff className='h-5 w-5' />
						) : (
							<Visibility className='h-5 w-5' />
						)}
					</button>
				)}
			</div>
			{error && <span className='text-red-500 text-sm mt-1'>{error}</span>}
		</div>
	)
}
