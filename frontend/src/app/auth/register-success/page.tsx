import { AUTH } from '@/constants/auth.constant'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { RegisterCompanySuccess } from '../RegisterCompanySuccess'

export const metadata: Metadata = {
	title: 'Registration successful',
}

export default async function RegisterSuccessPage({
	searchParams,
}: {
	searchParams: Promise<{ subdomain?: string }>
}) {
	const params = await searchParams
	const subdomain = params.subdomain ?? ''
	const cookieStore = await cookies()
	const isAuthenticated =
		cookieStore.get(AUTH.AUTH_STATUS)?.value === 'true'
	return (
		<RegisterCompanySuccess
			subdomain={subdomain}
			isAuthenticated={isAuthenticated}
		/>
	)
}
