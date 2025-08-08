'use client'

import { AuthLayout } from './AuthLayout'

export const LoginCompany = () => {
	return (
		<AuthLayout
			title='Authorization'
			onSubmit={e => {
				e.preventDefault()
			}}
			isLogin={true}
		>
			<div className='space-y-3'>login</div>
		</AuthLayout>
	)
}
