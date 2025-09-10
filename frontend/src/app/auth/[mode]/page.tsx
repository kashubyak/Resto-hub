import AuthPageClient from '../AuthPageClient'

export default function AuthPage({ params }: { params: { mode: string } }) {
	const mode = params.mode === 'login' ? 'login' : 'register'
	return <AuthPageClient mode={mode} />
}
