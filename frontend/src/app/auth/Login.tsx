'use client'

import { AuthContainer } from '@/components/container/AuthContainer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useLogin } from '@/hooks/useLogin'
import { emailValidation, passwordValidation } from '@/validation/login.validation'
import { subdomainValidation } from '@/validation/register.validation'
import { memo } from 'react'

function LoginComponent() {
	const { register, handleSubmit, errors, onSubmit } = useLogin()

	return (
		<AuthContainer title='Authorization' onSubmit={handleSubmit(onSubmit)} isLogin>
			<div className='space-y-3'>
				<Input
					label='Subdomain'
					register={register('subdomain', subdomainValidation)}
					error={errors.subdomain?.message}
				/>
				<Input
					type='email'
					label='Email'
					register={register('email', emailValidation)}
					error={errors.email?.message}
				/>
				<Input
					type='password'
					label='Password'
					register={register('password', passwordValidation)}
					error={errors.password?.message}
				/>
				<Button type='submit' text='Login' />
			</div>
		</AuthContainer>
	)
}

export const Login = memo(LoginComponent)
