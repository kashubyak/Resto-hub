import { login } from '@/services/auth'
import type { ILogin } from '@/types/login.interface'
import { useForm } from 'react-hook-form'

export const useLogin = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		clearErrors,
	} = useForm<ILogin>()
	const onSubmit = async (data: ILogin) => {
		const response = await login(data)
	}
	return { register, handleSubmit, errors, onSubmit }
}
