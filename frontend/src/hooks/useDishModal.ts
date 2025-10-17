import { useAlert } from '@/providers/AlertContext'
import { createDish } from '@/services/dish/create-dish.service'
import type { IDishFormValues } from '@/types/dish.interface'
import type { IAxiosError } from '@/types/error.interface'
import { parseBackendError } from '@/utils/errorHandler'
import { useCallback } from 'react'
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
	} = useForm<IDishFormValues>({
		mode: 'onChange',
		defaultValues: {
			ingredients: [],
			available: true,
		},
	})

	const onSubmit = useCallback(
		async (data: IDishFormValues) => {
			try {
				const formData = new FormData()
				formData.append('name', data.name.trim())
				formData.append('description', data.description.trim())
				formData.append('price', data.price.toString())

				if (data.categoryId != null)
					formData.append('categoryId', data.categoryId.toString())
				data.ingredients.forEach(ingredient =>
					formData.append('ingredients', ingredient.trim()),
				)

				if (data.weightGr != null) formData.append('weightGr', data.weightGr.toString())
				if (data.calories != null) formData.append('calories', data.calories.toString())
				formData.append('imageUrl', data.imageUrl[0])
				formData.append('available', data.available.toString())

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
		},
		[showSuccess, showError, refetchDishes, reset, onClose],
	)

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
