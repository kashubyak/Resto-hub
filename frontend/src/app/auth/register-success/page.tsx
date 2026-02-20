import type { Metadata } from 'next'
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
	return <RegisterCompanySuccess subdomain={subdomain} />
}
