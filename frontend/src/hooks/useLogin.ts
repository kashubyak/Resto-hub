import { ROUTES } from '@/constants/pages.constant'
import { useAlert } from '@/providers/AlertContext'
import { useAuth } from '@/providers/AuthContext'
import type { ILoginRequest } from '@/types/auth.interface'
import { getSubdomainFromHostname } from '@/utils/api'
import { toAxiosError } from '@/utils/errorConverter'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'

export const useLogin = () => {
	const searchParams = useSearchParams()
	const subdomainFromUrl = searchParams.get('subdomain')
	const hostnameSubdomain = getSubdomainFromHostname()

	const defaultSubdomain = hostnameSubdomain || subdomainFromUrl || ''

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<ILoginRequest>({
		defaultValues: {
			subdomain: defaultSubdomain,
		},
	})

	useEffect(() => {
		if (defaultSubdomain) setValue('subdomain', defaultSubdomain)
	}, [defaultSubdomain, setValue])

	const router = useRouter()
	const { login } = useAuth()
	const { showBackendError } = useAlert()

	const onSubmit = useCallback(
		async (data: ILoginRequest) => {
			try {
				await login(data)

				const redirectTo = searchParams.get('redirect')
				if (redirectTo && !redirectTo.startsWith(ROUTES.PUBLIC.AUTH.ROOT))
					router.push(redirectTo)
				else router.push(ROUTES.PRIVATE.SHARED.DASHBOARD)
			} catch (err: unknown) {
				showBackendError(toAxiosError(err))
			}
		},
		[login, searchParams, router, showBackendError],
	)

	return { register, handleSubmit, errors, onSubmit, setValue }
}
