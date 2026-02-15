import { headers } from 'next/headers'
import { AuthPageClient } from '../AuthPageClient'

export default async function AuthPage({
	params,
}: {
	params: Promise<{ mode: 'login' | 'register' }>
}) {
	const { mode } = await params
	const headersList = await headers()
	const host = headersList.get('host') ?? ''
	return <AuthPageClient mode={mode} host={host} />
}
