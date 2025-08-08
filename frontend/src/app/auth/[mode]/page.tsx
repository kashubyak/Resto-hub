import type { Metadata } from 'next'
import AuthPageClient from '../AuthPageClient'

type Props = {
	params: { mode: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const mode = params.mode === 'login' ? 'Login' : 'Register'
	return {
		title: `${mode}`,
	}
}

export default function AuthPage({ params }: Props) {
	return <AuthPageClient mode={params.mode} />
}
