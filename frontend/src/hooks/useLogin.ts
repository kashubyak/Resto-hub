import { ROUTES } from '@/constants/pages.constant'
import { useAlert } from '@/providers/AlertContext'
import { useAuth } from '@/providers/AuthContext'
import type { ILoginRequest } from '@/types/auth.interface'
import { getSubdomainFromHostname } from '@/utils/api'
import { toAxiosError } from '@/utils/errorConverter'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'

export const useLogin = () => {
	const searchParams = useSearchParams()
	const hostnameSubdomain = useMemo(() => getSubdomainFromHostname(), [])

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Omit<ILoginRequest, 'subdomain'>>({
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const router = useRouter()
	const { login } = useAuth()
	const { showBackendError } = useAlert()

	const onSubmit = useCallback(
		async (data: Omit<ILoginRequest, 'subdomain'>) => {
			try {
				await login({
					...data,
					subdomain: hostnameSubdomain ?? '',
				})

				const redirectTo = searchParams.get('redirect')
				if (redirectTo && !redirectTo.startsWith(ROUTES.PUBLIC.AUTH.ROOT))
					router.push(redirectTo)
				else router.push(ROUTES.PRIVATE.SHARED.DASHBOARD)
			} catch (err: unknown) {
				showBackendError(toAxiosError(err))
			}
		},
		[login, hostnameSubdomain, searchParams, router, showBackendError],
	)

	return { register, handleSubmit, errors, onSubmit }
}
