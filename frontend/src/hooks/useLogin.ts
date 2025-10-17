import { ROUTES } from '@/constants/pages.constant'
import { useAuth } from '@/providers/AuthContext'
import { useAlertStore } from '@/store/alert.store'
import type { ILoginRequest } from '@/types/auth.interface'
import { toAxiosError } from '@/utils/errorConverter'
import { parseBackendError } from '@/utils/errorHandler'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

export const useLogin = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ILoginRequest>()

	const router = useRouter()
	const { login } = useAuth()
	const searchParams = useSearchParams()

	const onSubmit = useCallback(
		async (data: ILoginRequest) => {
			try {
				await login(data)

				const redirectTo = searchParams.get('redirect')
				if (redirectTo && !redirectTo.startsWith(ROUTES.PUBLIC.AUTH.ROOT))
					router.push(redirectTo)
				else router.push('/')
			} catch (err: unknown) {
				useAlertStore.getState().setPendingAlert({
					severity: 'error',
					text: parseBackendError(toAxiosError(err)).join('\n'),
				})
			}
		},
		[login, searchParams, router],
	)

	return { register, handleSubmit, errors, onSubmit }
}
