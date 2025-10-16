import { useAlert } from '@/providers/AlertContext'
import { updateDishService } from '@/services/dish/update-dish.service'
import type { IDish, IDishFormValues } from '@/types/dish.interface'
import type { IAxiosError } from '@/types/error.interface'
import { parseBackendError } from '@/utils/errorHandler'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useDishes } from './useDishes'

const toNumber = (value: string | number | undefined): number | undefined => {
	if (typeof value === 'number') return value
	if (typeof value === 'string') {
		const num = parseFloat(value)
		return isNaN(num) ? undefined : num
	}
	return undefined
}

export const useUpdateDish = (dishData: IDish | undefined, onClose: () => void) => {
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

				const changedData: Partial<IDishFormValues> & { id: number } = {
					id: dishData.id,
				}

				// delete any types later
				const fieldMapping: Array<{
					key: keyof typeof dirtyFields
					value: any
					converter?: (val: any) => any
				}> = [
					{ key: 'name', value: formData.name },
					{ key: 'description', value: formData.description },
					{ key: 'price', value: formData.price, converter: toNumber },
					{ key: 'categoryId', value: formData.categoryId },
					{ key: 'ingredients', value: formData.ingredients },
					{ key: 'weightGr', value: formData.weightGr, converter: toNumber },
					{ key: 'calories', value: formData.calories, converter: toNumber },
					{ key: 'available', value: formData.available },
					{ key: 'imageUrl', value: formData.imageUrl },
				]

				fieldMapping.forEach(({ key, value, converter }) => {
					if (dirtyFields[key]) changedData[key] = converter ? converter(value) : value
				})

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
