'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useLogin } from '@/hooks/useLogin'
import { AuthContainer } from '../../components/container/AuthContainer'

export const Login = () => {
	const { register, handleSubmit, errors, onSubmit } = useLogin()
	return (
		<AuthContainer title='Authorization' onSubmit={handleSubmit(onSubmit)} isLogin={true}>
			<div className='space-y-3'>
				<Input
					type='text'
					label='Subdomain'
					register={register('subdomain', {
						required: 'Subdomain is required',
						validate: {
							lowerCase: value =>
								/^[a-z0-9]+$/.test(value) || 'Only lowercase letters and numbers allowed',
							startsWithLetter: value =>
								/^[a-z]/.test(value) || 'Subdomain must start with a letter',
							endsWithAlphanumeric: value =>
								/[a-z0-9]$/.test(value) || 'Subdomain must end with a letter or number',
							minLength: value =>
								value.length >= 3 || 'Subdomain must be at least 3 characters',
							maxLength: value =>
								value.length <= 30 || 'Subdomain must be at most 30 characters',
							noConsecutiveNumbers: value =>
								!/\d{4,}/.test(value) || 'Invalid subdomain format',
							notReserved: value => {
								const reserved = [
									'www',
									'api',
									'admin',
									'mail',
									'ftp',
									'blog',
									'test',
									'dev',
									'staging',
									'prod',
									'production',
								]
								return (
									!reserved.includes(value.toLowerCase()) || 'This subdomain is reserved'
								)
							},
							balanced: value => {
								const letters = (value.match(/[a-z]/g) || []).length
								return letters >= 2 || 'Invalid subdomain format'
							},
							noSpaces: value => !/\s/.test(value) || 'Subdomain cannot contain spaces',
							validFormat: value =>
								/^[a-z][a-z0-9]*[a-z0-9]$/.test(value) ||
								value.length === 1 ||
								'Invalid subdomain format',
						},
					})}
					error={errors.subdomain?.message}
				/>
				<Input
					type='email'
					label='Email'
					register={register('email', {
						required: 'Email is required',
						validate: {
							validEmail: value => {
								const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
								return emailRegex.test(value) || 'Please enter a valid email address'
							},
							minLength: value => value.length >= 5 || 'Email address is too short',
							maxLength: value => value.length <= 254 || 'Email address is too long',
							noConsecutiveDots: value => !/\.{2,}/.test(value) || 'Invalid email format',
							validLocalPart: value => {
								const localPart = value.split('@')[0]
								return (
									(localPart && localPart.length <= 64 && localPart.length >= 1) ||
									'Invalid email format'
								)
							},
							validDomain: value => {
								const parts = value.split('@')
								if (parts.length !== 2) return 'Invalid email format'
								const domain = parts[1]
								return (
									(domain &&
										domain.includes('.') &&
										!domain.startsWith('.') &&
										!domain.endsWith('.') &&
										domain.length >= 4) ||
									'Invalid email format'
								)
							},
							noSpaces: value => !/\s/.test(value) || 'Email cannot contain spaces',
							startsCorrectly: value => !/^[.\-_]/.test(value) || 'Invalid email format',
							endsCorrectly: value => !/[.\-_]@/.test(value) || 'Invalid email format',
							validCharacters: value =>
								/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+$/.test(value) ||
								'Email contains invalid characters',
							domainValidation: value => {
								const domain = value.split('@')[1]
								if (!domain) return 'Invalid email format'
								return !/^-|-$|\.{2,}/.test(domain) || 'Invalid email domain format'
							},
						},
					})}
					error={errors.email?.message}
				/>
				<Input
					type='password'
					label='Password'
					register={register('password', {
						required: 'Password is required',
						validate: {
							minLength: value => value.length >= 1 || 'Password cannot be empty',
							maxLength: value => value.length <= 128 || 'Password is too long',
							validCharacters: value =>
								/^[\x20-\x7E\u00A0-\uFFFF]*$/.test(value) ||
								'Password contains invalid characters',
							noOnlySpaces: value =>
								value.trim().length > 0 || 'Password cannot contain only spaces',
							notCommonWeak: value => {
								const weak = [
									'123456',
									'password',
									'admin',
									'12345678',
									'qwerty',
									'abc123',
								]
								return (
									!weak.includes(value.toLowerCase()) ||
									'This password is too common and weak'
								)
							},
						},
					})}
					error={errors.password?.message}
				/>
				<Button type='submit' text='Login' />
			</div>
		</AuthContainer>
	)
}
