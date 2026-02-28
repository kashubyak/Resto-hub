import { headers } from 'next/headers'
import { AuthPageClient } from '../AuthPageClient'

export default async function AuthPage({
	params,
}: {
	params: Promise<{ mode: 'login' | 'register' }>
}) {
	const { mode } = await params
	const host = mode === 'login' ? ((await headers()).get('host') ?? '') : ''
	return <AuthPageClient mode={mode} host={host} />
}
