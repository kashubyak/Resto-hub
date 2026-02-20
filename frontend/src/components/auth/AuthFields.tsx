'use client'

import type { ReactNode } from 'react'
import type {
	Control,
	FieldPath,
	FieldValues,
	RegisterOptions,
} from 'react-hook-form'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'

const inputBase =
	'w-full pr-4 py-3 bg-input rounded-xl border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all'
const inputError = 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
const inputNormal = 'border-border focus:border-primary focus:ring-primary/20'

export interface AuthTextFieldProps {
	id: string
	label: string
	error?: string
	placeholder?: string
	autoComplete?: string
	type?: 'text' | 'email'
	leftIcon?: ReactNode
	hint?: ReactNode
	register: UseFormRegisterReturn
}

export function AuthTextField({
	id,
	label,
	error,
	placeholder,
	autoComplete,
	type = 'text',
	leftIcon,
	hint,
	register,
}: AuthTextFieldProps) {
	const inputClassName = `${inputBase} ${leftIcon ? 'pl-12' : 'pl-4'} ${error ? inputError : inputNormal}`

	return (
		<div className="space-y-2">
			<label
				htmlFor={id}
				className="block text-sm font-medium text-card-foreground"
			>
				{label}
			</label>
			<div className="relative">
				{leftIcon && (
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
						{leftIcon}
					</div>
				)}
				<input
					key={id}
					{...register}
					id={id}
					type={type}
					autoComplete={autoComplete}
					placeholder={placeholder}
					className={inputClassName}
				/>
			</div>
			{error && (
				<div className="flex items-center gap-1.5 text-red-500 mt-1">
					<AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
					<p className="text-xs">{error}</p>
				</div>
			)}
			{!error && hint && (
				<div className="text-xs text-muted-foreground mt-1">{hint}</div>
			)}
		</div>
	)
}

export interface AuthControllerTextFieldProps<T extends FieldValues> {
	control: Control<T>
	name: FieldPath<T>
	rules?: RegisterOptions<T>
	id: string
	label: string
	autocompleteName: string
	type?: 'text' | 'email'
	autoComplete?: string
	placeholder?: string
	leftIcon?: ReactNode
	error?: string
}

export function AuthControllerTextField<T extends FieldValues>({
	control,
	name,
	rules,
	id,
	label,
	autocompleteName,
	type = 'text',
	autoComplete,
	placeholder,
	leftIcon,
	error,
}: AuthControllerTextFieldProps<T>) {
	const inputClassName = `${inputBase} ${leftIcon ? 'pl-12' : 'pl-4'} ${error ? inputError : inputNormal}`

	return (
		<Controller
			control={control}
			name={name}
			rules={rules}
			render={({ field }) => (
				<div className="space-y-2">
					<label
						htmlFor={id}
						className="block text-sm font-medium text-card-foreground"
					>
						{label}
					</label>
					<div className="relative">
						{leftIcon && (
							<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
								{leftIcon}
							</div>
						)}
						<input
							{...field}
							id={id}
							name={autocompleteName}
							type={type}
							autoComplete={autoComplete}
							placeholder={placeholder}
							className={inputClassName}
						/>
					</div>
					{error && (
						<div className="flex items-center gap-1.5 text-red-500 mt-1">
							<AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
							<p className="text-xs">{error}</p>
						</div>
					)}
				</div>
			)}
		/>
	)
}

export interface AuthPasswordFieldProps {
	id: string
	label: string
	error?: string
	placeholder?: string
	autoComplete?: string
	leftIcon?: ReactNode
	register: UseFormRegisterReturn
	showPassword: boolean
	onTogglePassword: () => void
	rightLabel?: ReactNode
}

export function AuthPasswordField({
	id,
	label,
	error,
	placeholder = '••••••••',
	autoComplete,
	leftIcon,
	register,
	showPassword,
	onTogglePassword,
	rightLabel,
}: AuthPasswordFieldProps) {
	const inputClassName = `${inputBase} pl-12 pr-12 ${error ? inputError : inputNormal}`

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<label
					htmlFor={id}
					className="block text-sm font-medium text-card-foreground"
				>
					{label}
				</label>
				{rightLabel}
			</div>
			<div className="relative">
				{leftIcon && (
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
						{leftIcon}
					</div>
				)}
				<input
					key={id}
					{...register}
					id={id}
					type={showPassword ? 'text' : 'password'}
					autoComplete={autoComplete}
					placeholder={placeholder}
					className={inputClassName}
				/>
				<button
					type="button"
					onClick={onTogglePassword}
					aria-label={showPassword ? 'Hide password' : 'Show password'}
					className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-card-foreground transition-colors"
				>
					{showPassword ? (
						<EyeOff className="h-5 w-5" />
					) : (
						<Eye className="h-5 w-5" />
					)}
				</button>
			</div>
			{error && (
				<div className="flex items-center gap-1.5 text-red-500 mt-1">
					<AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
					<p className="text-xs">{error}</p>
				</div>
			)}
		</div>
	)
}
