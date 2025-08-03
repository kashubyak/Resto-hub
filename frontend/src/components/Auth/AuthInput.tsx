'use client'

import { Visibility, VisibilityOff } from '@mui/icons-material'
import { IconButton, InputAdornment, TextField, type TextFieldProps } from '@mui/material'
import { useState } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

type AuthInputProps = {
	error?: string
	register?: UseFormRegisterReturn
	type: 'text' | 'email' | 'password' | 'number'
} & Omit<TextFieldProps, 'type' | 'error'>

export const AuthInput = ({ register, error, type, ...rest }: AuthInputProps) => {
	const [showPassword, setShowPassword] = useState(false)
	const isPasswordField = type === 'password'
	const togglePasswordVisibility = () => setShowPassword(!showPassword)
	const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type

	return (
		<div className='flex flex-col'>
			<TextField
				{...register}
				{...rest}
				type={inputType}
				variant='outlined'
				fullWidth
				error={!!error}
				helperText={null}
				InputProps={{
					...rest.InputProps,
					endAdornment: isPasswordField ? (
						<InputAdornment position='end'>
							<IconButton
								onClick={togglePasswordVisibility}
								edge='end'
								tabIndex={-1}
								aria-label={showPassword ? 'Hide password' : 'Show password'}
								sx={{
									transition: 'all 0.2s ease',
									'&:hover': {
										color: 'var(--foreground)',
										backgroundColor:
											'color-mix(in oklab, var(--foreground) 10%, transparent)',
									},
									'&:active': {
										transform: 'scale(0.9)',
										backgroundColor:
											'color-mix(in oklab, var(--foreground) 20%, transparent)',
									},
								}}
							>
								{showPassword ? (
									<VisibilityOff className='text-muted-foreground h-5 w-5' />
								) : (
									<Visibility className='text-muted-foreground h-5 w-5' />
								)}
							</IconButton>
						</InputAdornment>
					) : (
						rest.InputProps?.endAdornment
					),
				}}
				sx={{
					'& .MuiOutlinedInput-root': {
						backgroundColor: 'var(--input)',
						color: 'var(--foreground)',
						borderRadius: '6px',
						'& fieldset': {
							borderColor: error ? 'var(--destructive)' : 'var(--border)',
							borderWidth: '1px',
						},
						'&:hover fieldset': {
							borderColor: error ? 'var(--destructive)' : 'var(--border)',
						},
						'&.Mui-focused fieldset': {
							borderColor: error ? 'var(--destructive)' : 'var(--ring)',
							borderWidth: '2px',
						},
					},
					'& .MuiInputLabel-root': {
						color: error ? 'var(--destructive)' : 'var(--muted-foreground)',
						'&.Mui-focused': {
							color: error ? 'var(--destructive)' : 'var(--ring)',
						},
					},
					'& .MuiFormHelperText-root': {
						display: 'none',
					},
					...rest.sx,
				}}
			/>
			{error && <span className='text-[var(--destructive)] text-sm mt-1'>{error}</span>}
		</div>
	)
}
