import { useAlert } from '@/providers/AlertContext'
import { createDish } from '@/services/dish/create-dish.service'
import type { IFormValues } from '@/types/dish.interface'
import type { IAxiosError } from '@/types/error.interface'
import { parseBackendError } from '@/utils/errorHandler'
import { useForm } from 'react-hook-form'
import { useDishes } from './useDishes'

export const useDishModal = (onClose: () => void) => {
	const { showError, showSuccess } = useAlert()
	const { refetchDishes } = useDishes()
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		control,
		setError,
		clearErrors,
		watch,
	} = useForm<IFormValues>({
		mode: 'onChange',
		defaultValues: {
			ingredients: [],
		},
	})

	const onSubmit = async (data: IFormValues) => {
		try {
			const formData = new FormData()
			formData.append('name', data.name.trim())
			formData.append('description', data.description.trim())
			formData.append('price', data.price.toString())
			formData.append('categoryId', data.categoryId.toString())
			data.ingredients.forEach(ingredient =>
				formData.append('ingredients', ingredient.trim()),
			)
			formData.append('weightGr', data.weightGr.toString())
			formData.append('calories', data.calories.toString())
			if (data.imageUrl && data.imageUrl.length > 0)
				formData.append('imageUrl', data.imageUrl[0])

			const response = await createDish(formData, { _hideGlobalError: true })
			if (response.status === 201) {
				showSuccess('Dish created successfully')
				refetchDishes()
				reset()
				onClose()
			}
		} catch (err) {
			showError(parseBackendError(err as IAxiosError).join('\n'))
		}
	}

	return {
		onSubmit,
		register,
		errors,
		handleSubmit,
		setValue,
		control,
		setError,
		clearErrors,
		watch,
	}
}
