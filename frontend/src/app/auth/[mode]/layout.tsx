import type { Metadata } from 'next'

type Props = { children: React.ReactNode }

export async function generateMetadata({
	params,
}: {
	params: Promise<{ mode?: string }>
}): Promise<Metadata> {
	const { mode } = await params
	return { title: mode === 'login' ? 'Login' : 'Register' }
}

export default function AuthLayout({ children }: Props) {
	return <>{children}</>
}
