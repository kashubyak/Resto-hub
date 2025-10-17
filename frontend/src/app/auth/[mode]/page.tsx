import { AuthPageClient } from '../AuthPageClient'

export default async function AuthPage({
	params,
}: {
	params: Promise<{ mode: 'login' | 'register' }>
}) {
	const { mode } = await params
	return <AuthPageClient mode={mode} />
}
