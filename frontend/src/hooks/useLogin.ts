import { login } from '@/services/auth.service'
import type { ILogin } from '@/types/login.interface'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'

export const useLogin = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ILogin>()
	const router = useRouter()
	const searchParams = useSearchParams()

	const onSubmit = async (data: ILogin) => {
		try {
			const response = await login(data)
			if (response.status === 200) {
				const redirectTo = searchParams.get('redirect')

				if (redirectTo && redirectTo.startsWith('/auth')) router.push(redirectTo)
				else router.push('/')
			}
			console.log(response)
		} catch (err) {
			console.error(err)
		}
	}

	return { register, handleSubmit, errors, onSubmit }
}
