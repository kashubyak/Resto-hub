import { useAlert } from '@/providers/AlertContext'
import { useAuth } from '@/providers/AuthContext'
import type { ILogin } from '@/types/login.interface'
import { toAxiosError } from '@/utils/errorConverter'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'

export const useLogin = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ILogin>()
	const router = useRouter()
	const { login } = useAuth()
	const { showSuccess, showBackendError } = useAlert()
	const searchParams = useSearchParams()

	const onSubmit = async (data: ILogin) => {
		try {
			await login(data)
			showSuccess('Login successful!')
			const redirectTo = searchParams.get('redirect')
			if (redirectTo && redirectTo.startsWith('/auth')) {
				router.push(redirectTo)
			} else {
				router.push('/')
			}
		} catch (err: unknown) {
			showBackendError(toAxiosError(err))
		}
	}

	return { register, handleSubmit, errors, onSubmit }
}
