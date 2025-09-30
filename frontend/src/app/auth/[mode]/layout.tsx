import type { Metadata } from 'next'
import { memo } from 'react'

type Props = { children: React.ReactNode }

export async function generateMetadata({
	params,
}: {
	params: Promise<{ mode?: string }>
}): Promise<Metadata> {
	const { mode } = await params
	return { title: mode === 'login' ? 'Login' : 'Register' }
}

function AuthLayoutComponent({ children }: Props) {
	return <>{children}</>
}

export const AuthLayout = memo(AuthLayoutComponent)
