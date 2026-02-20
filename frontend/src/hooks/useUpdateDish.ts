import { useAlert } from '@/providers/AlertContext'
import { updateDishService } from '@/services/dish/update-dish.service'
import type { IDish, IDishFormValues } from '@/types/dish.interface'
import type { IAxiosError } from '@/types/error.interface'
import { parseBackendError } from '@/utils/errorHandler'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useDishes } from './useDishes'

const toNumber = (
	value: string | number | null | undefined,
): number | null | undefined => {
	if (value === null || value === undefined) return value
	if (typeof value === 'number') return value
	if (typeof value === 'string') {
		const num = parseFloat(value)
		return isNaN(num) ? undefined : num
	}
	return undefined
}

export const useUpdateDish = (
	dishData: IDish | undefined,
	onClose: () => void,
) => {
	const { showError, showSuccess } = useAlert()
	const { refetchDishes, updateDishCache } = useDishes()
	const queryClient = useQueryClient()

	const defaultValues = useMemo(
		() => ({
			name: '',
			description: '',
			price: '',
			categoryId: undefined,
			ingredients: [],
			weightGr: undefined,
			calories: undefined,
			available: true,
		}),
		[],
	)

	const {
		handleSubmit,
		formState: { errors, isDirty, dirtyFields },
		reset,
		control,
		setError,
		clearErrors,
		watch,
		trigger,
	} = useForm<IDishFormValues>({
		mode: 'onChange',
		defaultValues,
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

				const changedData: Record<string, unknown> & { id: number } = {
					id: dishData.id,
				}

				if (dirtyFields.name) changedData.name = formData.name
				if (dirtyFields.description)
					changedData.description = formData.description
				if (dirtyFields.price) changedData.price = toNumber(formData.price)
				if (dirtyFields.categoryId) changedData.categoryId = formData.categoryId
				if (dirtyFields.ingredients)
					changedData.ingredients = formData.ingredients
				if (dirtyFields.weightGr)
					changedData.weightGr = toNumber(formData.weightGr)
				if (dirtyFields.calories)
					changedData.calories = toNumber(formData.calories)
				if (dirtyFields.available !== undefined)
					changedData.available = formData.available
				if (dirtyFields.imageUrl) changedData.imageUrl = formData.imageUrl

				const { data } = await updateDishService(changedData)
				updateDishCache(queryClient, data)
				showSuccess('Dish updated successfully')
				refetchDishes()
				onClose()
			} catch (err) {
				showError(parseBackendError(err as IAxiosError).join('\n'))
			}
		},
		[
			dishData,
			dirtyFields,
			queryClient,
			updateDishCache,
			showSuccess,
			refetchDishes,
			onClose,
			showError,
		],
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
		trigger,
	}
}
