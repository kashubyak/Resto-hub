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
	const onSubmit = (data: IFormValues) => {
		console.log(data)
	}
	return { register, handleSubmit, errors, onSubmit }
}
