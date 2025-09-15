import { useAlert } from '@/providers/AlertContext'
import type { IAxiosError } from '@/types/error.interface'
import { parseBackendError } from '@/utils/errorHandler'
import { useForm } from 'react-hook-form'

interface IFormValues {
	name: string
	description: string
	price: number
	categoryId: number
	ingredients: string[]
	imageUrl: FileList
	weightGr: number
	calories: number
	available: boolean
}
export const useDishModal = () => {
	const { showError } = useAlert()
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
	} = useForm<IFormValues>({
		mode: 'onChange',
	})
	const onSubmit = async (data: IFormValues) => {
		console.log(data)
		try {
			const formData = new FormData()
			formData.append('name', data.name)
			formData.append('description', data.description)
			formData.append('price', data.price.toString())
			formData.append('categoryId', data.categoryId.toString())
			data.ingredients.forEach(ingredient => formData.append('ingredients', ingredient))
			formData.append('weightGr', data.weightGr.toString())
			formData.append('calories', data.calories.toString())
			formData.append('available', data.available.toString())
			if (data.imageUrl?.[0]) formData.append('imageUrl', data.imageUrl?.[0])
			// await createDish(formData)
		} catch (err) {
			showError(parseBackendError(err as IAxiosError).join('\n'))
		}
	}

	return { onSubmit, register, errors, handleSubmit }
}
