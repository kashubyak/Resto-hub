'use client'

import { AuthLayout } from './AuthLayout'

export const LoginCompany = ({ toggleMode }: { toggleMode: () => void }) => {
	return (
		<AuthLayout
			title='Login'
			onSubmit={e => {
				e.preventDefault()
			}}
			toggleMode={toggleMode}
			isLogin={true}
		>
			<div className='space-y-3'>login</div>
		</AuthLayout>
	)
}
