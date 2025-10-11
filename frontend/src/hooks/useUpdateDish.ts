import { useAlert } from '@/providers/AlertContext'
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
		formState: { errors, isDirty },
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
		async (data: IDishFormValues) => {
			try {
				console.log(data)
				showSuccess('Dish updated successfully')
				refetchDishes()
				onClose()
			} catch (err) {
				showError(parseBackendError(err as IAxiosError).join('\n'))
			}
		},
		[showSuccess, showError, refetchDishes, onClose],
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
