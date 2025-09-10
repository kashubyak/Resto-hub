import type { Metadata } from 'next'

type Props = { children: React.ReactNode }

export async function generateMetadata({
	params,
}: {
	params: { mode?: string }
}): Promise<Metadata> {
	const mode = params?.mode === 'login' ? 'Login' : 'Register'
	return { title: mode }
}

export default function AuthLayout({ children }: Props) {
	return <>{children}</>
}
