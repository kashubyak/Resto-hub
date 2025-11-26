'use client'

import { useAlert } from '@/providers/AlertContext'
import { createCategory } from '@/services/category/create-category.service'
import type { ICategoryFormValues } from '@/types/category.interface'
import type { IAxiosError } from '@/types/error.interface'
import { parseBackendError } from '@/utils/errorHandler'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useCategories } from './useCategories'

export const useCategoryModal = (onClose: () => void) => {
	const { showError, showSuccess } = useAlert()
	const { refetchCategories } = useCategories()

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<ICategoryFormValues>({
		mode: 'onChange',
		defaultValues: {
			name: '',
		},
	})

	const onSubmit = useCallback(
		async (data: ICategoryFormValues) => {
			try {
				const response = await createCategory({
					name: data.name.trim(),
				})
				if (response.status === 201) {
					showSuccess('Category created successfully')
					refetchCategories()
					reset()
					onClose()
				}
			} catch (err) {
				showError(parseBackendError(err as IAxiosError).join('\n'))
			}
		},
		[showSuccess, showError, refetchCategories, reset, onClose],
	)

	return {
		onSubmit,
		register,
		errors,
		handleSubmit,
		isSubmitting,
	}
}
