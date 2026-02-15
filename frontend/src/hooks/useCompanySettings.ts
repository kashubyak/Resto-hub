import { useAlert } from '@/providers/AlertContext'
import { getCompany } from '@/services/company/company.service'
import type { IAxiosError } from '@/types/error.interface'
import type { ICompanyInfo } from '@/types/company.interface'
import { getCompanyUrl, getSubdomainFromHostname } from '@/utils/api'
import { useCallback, useEffect, useState } from 'react'
import { useCopyToClipboard } from './useCopyToClipboard'

export const useCompanySettings = (userCompanyId?: number) => {
	const { showBackendError } = useAlert()
	const { copy, copied } = useCopyToClipboard()
	const [company, setCompany] = useState<ICompanyInfo | null>(null)

	const subdomain = getSubdomainFromHostname() || ''
	const companyUrl = subdomain ? getCompanyUrl(subdomain) : ''

	useEffect(() => {
		if (!userCompanyId) return
		getCompany()
			.then(res => setCompany(res.data))
			.catch(err => showBackendError(err as IAxiosError))
	}, [userCompanyId, showBackendError])

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
