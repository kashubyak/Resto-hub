import { useAlert } from '@/providers/AlertContext'
import { updateDishService } from '@/services/dish/update-dish.service'
import type { IDish, IDishFormValues } from '@/types/dish.interface'
import type { IAxiosError } from '@/types/error.interface'
import { parseBackendError } from '@/utils/errorHandler'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDishes } from './useDishes'

export const useUpdateDish = (dishData: IDish | undefined, onClose: () => void) => {
	const { showError, showSuccess } = useAlert()
	const { refetchDishes } = useDishes()

	const {
		handleSubmit,
		formState: { errors, isDirty, dirtyFields },
		reset,
		control,
		setError,
		clearErrors,
		watch,
	} = useForm<IDishFormValues>({
		mode: 'onChange',
		defaultValues: {
			name: '',
			description: '',
			price: 0,
			categoryId: undefined,
			ingredients: [],
			weightGr: undefined,
			calories: undefined,
			available: true,
		},
	})

	useEffect(() => {
		if (dishData) {
			reset({
				name: dishData.name,
				description: dishData.description,
				price: dishData.price,
				categoryId: dishData.categoryId || undefined,
				ingredients: dishData.ingredients,
				weightGr: dishData.weightGr || undefined,
				calories: dishData.calories || undefined,
				available: dishData.available,
			})
		}
	}, [dishData, reset])

	const onSubmit = useCallback(
		async (formData: IDishFormValues) => {
			try {
				if (!dishData) return

				const changedData: Partial<IDishFormValues> & { id: number } = {
					id: dishData.id,
				}

				if (dirtyFields.name) changedData.name = formData.name
				if (dirtyFields.description) changedData.description = formData.description
				if (dirtyFields.price) changedData.price = formData.price
				if (dirtyFields.categoryId) changedData.categoryId = formData.categoryId
				if (dirtyFields.ingredients) changedData.ingredients = formData.ingredients
				if (dirtyFields.weightGr) changedData.weightGr = formData.weightGr
				if (dirtyFields.calories) changedData.calories = formData.calories
				if (dirtyFields.available !== undefined)
					changedData.available = formData.available
				if (dirtyFields.imageUrl) changedData.imageUrl = formData.imageUrl

				await updateDishService(changedData)
				showSuccess('Dish updated successfully')
				refetchDishes()
				onClose()
			} catch (err) {
				showError(parseBackendError(err as IAxiosError).join('\n'))
			}
		},
		[showSuccess, showError, refetchDishes, onClose, dishData, dirtyFields],
	)

	return {
		onSubmit,
		errors,
		handleSubmit,
		control,
		setError,
		clearErrors,
		watch,
		isDirty,
		reset,
	}
}
