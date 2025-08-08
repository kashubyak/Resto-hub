'use client'

import { ROUTES } from '@/constants/pages.config'
import Link from 'next/link'

interface AuthContainerProps {
	title: string
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
	children: React.ReactNode
	encType?: string
	isLogin?: boolean
}

export const AuthContainer = ({
	title,
	onSubmit,
	children,
	encType,
	isLogin = false,
}: AuthContainerProps) => {
	return (
		<div className='w-screen h-screen bg-background text-foreground flex items-center justify-center p-4'>
			<div className='w-full max-w-xl bg-muted border border-border text-muted-foreground rounded-xl shadow-xl max-h-10/12 overflow-y-auto p-6'>
				<h1 className='text-primary text-2xl font-semibold mb-2 text-center'>{title}</h1>
				<form onSubmit={onSubmit} encType={encType} className='space-y-3 py-2'>
					{children}
				</form>
				<div className='pt-2 text-center text-sm'>
					{isLogin ? (
						<>
							Don’t have an account?{' '}
							<Link
								href={ROUTES.AUTH.REGISTER}
								className='text-primary hover:underline font-medium'
							>
								Register here
							</Link>
						</>
					) : (
						<>
							Already have an account?{' '}
							<Link
								href={ROUTES.AUTH.LOGIN}
								className='text-primary hover:underline font-medium'
							>
								Login here
							</Link>
						</>
					)}
				</div>
			</div>
		</div>
	)
}
