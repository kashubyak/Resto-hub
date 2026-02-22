'use client'

import { useAlert } from '@/providers/AlertContext'
import { createCategory } from '@/services/category/create-category.service'
import type { ICategoryFormValues } from '@/types/category.interface'
import type { IAxiosError } from '@/types/error.interface'
import { parseBackendError } from '@/utils/errorHandler'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { useCategories } from './useCategories'
import { IS_NEW_USER_QUERY_KEY } from './useIsNewUser'

export const useCategoryModal = (onClose: () => void) => {
	const { showError, showSuccess } = useAlert()
	const { refetchCategories } = useCategories()
	const queryClient = useQueryClient()

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
					// Invalidate newUser queries so user is no longer considered new
					queryClient.invalidateQueries({ queryKey: IS_NEW_USER_QUERY_KEY })
					reset()
					onClose()
				}
			} catch (err) {
				showError(parseBackendError(err as IAxiosError).join('\n'))
			}
		},
		[showSuccess, showError, refetchCategories, queryClient, reset, onClose],
	)

	return {
		onSubmit,
		register,
		errors,
		handleSubmit,
		isSubmitting,
	}
}
