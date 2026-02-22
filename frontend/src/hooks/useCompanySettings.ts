import { useAlert } from '@/providers/AlertContext'
import { getCompany } from '@/services/company/company.service'
import type { IAxiosError } from '@/types/error.interface'
import { getCompanyUrl, getSubdomainFromHostname } from '@/utils/api'
import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useCopyToClipboard } from './useCopyToClipboard'

const COMPANY_QUERY_KEY = ['company'] as const

export const useCompanySettings = (enabled = true) => {
	const { showBackendError } = useAlert()
	const { copy, copied } = useCopyToClipboard()

	const subdomain = getSubdomainFromHostname() || ''
	const companyUrl = subdomain ? getCompanyUrl(subdomain) : ''

	const { data: company = null } = useQuery({
		queryKey: COMPANY_QUERY_KEY,
		queryFn: async () => {
			try {
				const response = await getCompany()
				return response.data
			} catch (err) {
				showBackendError(err as IAxiosError)
				throw err
			}
		},
		enabled,
		staleTime: 5 * 60_000,
		gcTime: 30 * 60_000,
	})

	const handleCopy = useCallback(() => {
		if (companyUrl) copy(companyUrl)
	}, [companyUrl, copy])

	return {
		company,
		subdomain,
		companyUrl,
		copied,
		handleCopy,
	}
}

export { COMPANY_QUERY_KEY }
