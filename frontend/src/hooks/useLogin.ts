import { ROUTES } from '@/constants/pages.constant'
import { useAlert } from '@/providers/AlertContext'
import { useAuth } from '@/providers/AuthContext'
import type { ILoginRequest } from '@/types/auth.interface'
import { toAxiosError } from '@/utils/errorConverter'
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
	const { showBackendError } = useAlert()

	const onSubmit = useCallback(
		async (data: ILoginRequest) => {
			try {
				await login(data)

				const redirectTo = searchParams.get('redirect')
				if (redirectTo && !redirectTo.startsWith(ROUTES.PUBLIC.AUTH.ROOT))
					router.push(redirectTo)
				else router.push('/')
			} catch (err: unknown) {
				showBackendError(toAxiosError(err))
			}
		},
		[login, searchParams, router, showBackendError],
	)

	return { register, handleSubmit, errors, onSubmit }
}
