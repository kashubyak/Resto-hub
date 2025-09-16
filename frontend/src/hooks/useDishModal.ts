import { useAlert } from '@/providers/AlertContext'
import { createDish } from '@/services/dish/create-dish.service'
import type { IAxiosError } from '@/types/error.interface'
import { parseBackendError } from '@/utils/errorHandler'
import { useForm } from 'react-hook-form'

export interface IFormValues {
	name: string
	description: string
	price: number
	categoryId: number
	ingredients: string[]
	imageUrl: FileList
	weightGr: number
	calories: number
}

export const useDishModal = (onClose: () => void) => {
	const { showError, showSuccess } = useAlert()

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm<IFormValues>({
		mode: 'onChange',
	})

	const onSubmit = async (data: IFormValues) => {
		try {
			const formData = new FormData()
			formData.append('name', data.name.trim())
			formData.append('description', data.description.trim())
			formData.append('price', data.price.toString())
			formData.append('categoryId', data.categoryId.toString())
			data.ingredients.forEach(ingredient => formData.append('ingredients', ingredient))
			formData.append('weightGr', data.weightGr.toString())
			formData.append('calories', data.calories.toString())

			if (data.imageUrl && data.imageUrl.length > 0) {
				formData.append('imageUrl', data.imageUrl[0])
			}

			const response = await createDish(formData)
			if (response.status === 201) {
				showSuccess('Dish created successfully')
				reset()
				onClose()
			}
		} catch (err) {
			showError(parseBackendError(err as IAxiosError).join('\n'))
		}
	}

	return { onSubmit, register, errors, handleSubmit, setValue }
}
