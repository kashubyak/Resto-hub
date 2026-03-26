import { COMPANY_QUERY_KEY } from '@/constants/query-keys.constant'
import { useAlert } from '@/providers/AlertContext'
import { getCompanyService } from '@/services/company/get-company.service'
import type { IAxiosError } from '@/types/error.interface'
import { getCompanyUrl, getSubdomainFromHostname } from '@/utils/api'
import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useCopyToClipboard } from './useCopyToClipboard'

export const companyQueryKey = [COMPANY_QUERY_KEY.CURRENT] as const

export const useCompanySettings = (enabled = true) => {
	const { showBackendError } = useAlert()
	const { copy, copied } = useCopyToClipboard()

	const subdomain = getSubdomainFromHostname() ?? ''
	const companyUrl = subdomain ? getCompanyUrl(subdomain) : ''

	const { data: company = null } = useQuery({
		queryKey: companyQueryKey,
		queryFn: async () => {
			try {
				const response = await getCompanyService()
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
		if (companyUrl) void copy(companyUrl)
	}, [companyUrl, copy])

	return {
		company,
		subdomain,
		companyUrl,
		copied,
		handleCopy,
	}
}
