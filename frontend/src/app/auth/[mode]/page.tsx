import AuthPageClient from '../AuthPageClient'

export default async function AuthPage({
	params,
}: {
	params: Promise<{ mode: string }>
}) {
	const { mode } = await params
	const safeMode = mode === 'login' ? 'login' : 'register'

	return <AuthPageClient mode={safeMode} />
}
