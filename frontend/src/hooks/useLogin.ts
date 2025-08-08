import { useForm } from 'react-hook-form'

interface IFormValues {
	subdomain: string
	name: string
	email: string
	password: string
}
export const useLogin = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		clearErrors,
	} = useForm<IFormValues>()
	return { register, handleSubmit, errors }
}
