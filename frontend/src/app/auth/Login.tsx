'use client'

import { AuthInput } from '@/components/ui/AuthInput'
import { useLogin } from '@/hooks/useLogin'
import { AuthContainer } from '../../components/container/AuthContainer'

export const Login = () => {
	const { register, handleSubmit, errors } = useLogin()
	return (
		<AuthContainer
			title='Authorization'
			onSubmit={e => {
				e.preventDefault()
			}}
			isLogin={true}
		>
			<div className='space-y-3'>
				<AuthInput
					type='text'
					label='Subdomain'
					register={register('subdomain', { required: 'Subdomain is required' })}
					error={errors.subdomain?.message}
				/>
				<AuthInput
					type='email'
					label='Email'
					register={register('email', { required: 'Email is required' })}
					error={errors.email?.message}
				/>
				<AuthInput
					type='password'
					label='Password'
					register={register('password', { required: 'Password is required' })}
					error={errors.password?.message}
				/>
			</div>
		</AuthContainer>
	)
}
