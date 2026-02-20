'use client'

import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
	IconButton,
	InputAdornment,
	TextField,
	type TextFieldProps,
} from '@mui/material'
import { memo, useCallback, useMemo, useState } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

type InputProps = {
	error?: string
	register?: UseFormRegisterReturn
	type?: 'text' | 'email' | 'password' | 'number'
	multiline?: boolean
	rows?: number
	size?: 'small' | 'medium'
} & Omit<TextFieldProps, 'type' | 'error' | 'rows' | 'size'>

export const Input = memo<InputProps>(
	({
		register,
		error,
		type = 'text',
		multiline = false,
		rows = 4,
		size,
		...rest
	}) => {
		const [showPassword, setShowPassword] = useState(false)

		const finalSize = size || 'medium'
		const isPasswordField = type === 'password' && !multiline

		const togglePasswordVisibility = useCallback(
			() => setShowPassword((prev) => !prev),
			[],
		)

		const inputType = useMemo(() => {
			if (!isPasswordField) return type
			return showPassword ? 'text' : 'password'
		}, [isPasswordField, showPassword, type])

		const safeValue = useMemo(() => {
			return typeof rest.value === 'number' && Number.isNaN(rest.value)
				? ''
				: rest.value
		}, [rest.value])

		const iconButtonSx = useMemo(
			() => ({
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
			}),
			[],
		)

		const inputProps = useMemo(
			() => ({
				...rest.InputProps,
				endAdornment: isPasswordField ? (
					<InputAdornment position="end">
						<IconButton
							onClick={togglePasswordVisibility}
							edge="end"
							tabIndex={-1}
							aria-label={showPassword ? 'Hide password' : 'Show password'}
							sx={iconButtonSx}
						>
							{showPassword ? (
								<VisibilityOff className="text-muted-foreground h-5 w-5" />
							) : (
								<Visibility className="text-muted-foreground h-5 w-5" />
							)}
						</IconButton>
					</InputAdornment>
				) : (
					rest.InputProps?.endAdornment
				),
			}),
			[
				rest.InputProps,
				isPasswordField,
				togglePasswordVisibility,
				showPassword,
				iconButtonSx,
			],
		)

		const textFieldSx = useMemo(
			() => ({
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
						borderColor: error ? 'var(--destructive)' : 'var(--primary)',
						borderWidth: '2px',
					},
					'&.Mui-error fieldset': {
						borderColor: 'var(--destructive) !important',
					},
				},
				'& .MuiInputLabel-root': {
					color: error
						? 'var(--destructive)'
						: 'color-mix(in oklab, var(--foreground) 70%, transparent)',
					'&.Mui-focused': {
						color: error ? 'var(--destructive)' : 'var(--primary)',
					},
				},
				'& .MuiFormHelperText-root': {
					display: 'none',
				},
				maxWidth: '100%',
				...rest.sx,
			}),
			[error, rest.sx],
		)

		return (
			<div className="flex flex-col">
				<TextField
					{...register}
					{...rest}
					value={safeValue}
					type={multiline ? undefined : inputType}
					multiline={multiline}
					minRows={multiline ? rows : undefined}
					variant="outlined"
					fullWidth
					error={!!error}
					helperText={null}
					size={finalSize}
					InputProps={inputProps}
					sx={textFieldSx}
				/>
				{error && (
					<span className="text-[var(--destructive)] text-sm mt-1">
						{error}
					</span>
				)}
			</div>
		)
	},
)

Input.displayName = 'Input'
