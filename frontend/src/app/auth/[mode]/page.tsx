import type { Metadata } from 'next'
import AuthPageClient from '../AuthPageClient'

interface Props {
	params: Promise<{ mode: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const resolvedParams = await params
	const mode = resolvedParams.mode === 'login' ? 'Login' : 'Register'
	return {
		title: `${mode}`,
	}
}

export default async function AuthPage({ params }: Props) {
	const resolvedParams = await params
	const mode = resolvedParams.mode === 'login' ? 'login' : 'register'
	return <AuthPageClient mode={mode} />
}
