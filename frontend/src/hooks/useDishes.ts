'use client'

import { ROUTES } from '@/constants/pages.constant'
import { DISHES_QUERY_KEY } from '@/constants/query-keys.constant'
import { useAlert } from '@/providers/AlertContext'
import { deleteDishFromCategory } from '@/services/dish/delete-dish-category.service'
import { deleteDish } from '@/services/dish/delete-dish.service'
import { getDish } from '@/services/dish/get-dish.service'
import { getAllDishes } from '@/services/dish/get-dishes.service'
import type { IDish, IDishListResponse } from '@/types/dish.interface'
import type { IAxiosError } from '@/types/error.interface'
import { parseBackendError } from '@/utils/errorHandler'
import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
	type InfiniteData,
} from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'

const LIMIT = 10

export const useDishes = (dishId?: number) => {
	const queryClient = useQueryClient()
	const router = useRouter()
	const { showSuccess, showError } = useAlert()

	const dishesQuery = useInfiniteQuery<IDishListResponse, Error>({
		queryKey: [DISHES_QUERY_KEY.ALL],
		queryFn: async ({ pageParam }) => {
			const response = await getAllDishes({
				page: pageParam as number,
				limit: LIMIT,
			})
			return response.data
		},
		getNextPageParam: lastPage =>
			lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
		initialPageParam: 1,
		enabled: !dishId,
	})

	const dishQuery = useQuery<IDish, Error>({
		queryKey: [DISHES_QUERY_KEY.DETAIL, dishId],
		queryFn: async () => {
			const response = await getDish(dishId!)
			return response.data
		},
		enabled: !!dishId,
	})

	const handleDeleteDishSuccess = useCallback(() => {
		showSuccess('Dish deleted successfully')
		queryClient.invalidateQueries({ queryKey: [DISHES_QUERY_KEY.ALL] })
		router.push(ROUTES.PRIVATE.ADMIN.DISH)
	}, [showSuccess, queryClient, router])

	const handleDeleteDishError = useCallback(
		(err: unknown) => showError(parseBackendError(err as IAxiosError).join('\n')),
		[showError],
	)

	const deleteDishMutation = useMutation({
		mutationFn: async (id: number) => {
			const response = await deleteDish(id)
			return response.data
		},
		onSuccess: handleDeleteDishSuccess,
		onError: handleDeleteDishError,
	})

	const handleDeleteDishFromCategorySuccess = useCallback(
		(updatedDish: IDish) => {
			showSuccess('Dish removed from category successfully')

			queryClient.setQueryData<IDish>(
				[DISHES_QUERY_KEY.DETAIL, updatedDish.id],
				updatedDish,
			)

			queryClient.setQueryData<InfiniteData<IDishListResponse>>(
				[DISHES_QUERY_KEY.ALL],
				oldData => {
					if (!oldData) return oldData

					return {
						...oldData,
						pages: oldData.pages.map((page: IDishListResponse) => ({
							...page,
							data: page.data.map((dish: IDish) =>
								dish.id === updatedDish.id ? updatedDish : dish,
							),
						})),
					}
				},
			)
		},
		[showSuccess, queryClient],
	)
	const handleDeleteDishFromCategoryError = useCallback(
		(err: unknown) => showError(parseBackendError(err as IAxiosError).join('\n')),
		[showError],
	)

	const deleteCategoryFromDishMutation = useMutation({
		mutationFn: async (id: number) => {
			const response = await deleteDishFromCategory(id)
			return response.data
		},
		onSuccess: handleDeleteDishFromCategorySuccess,
		onError: handleDeleteDishFromCategoryError,
	})

	const refetchDishes = useCallback(
		() => queryClient.invalidateQueries({ queryKey: [DISHES_QUERY_KEY.ALL] }),
		[queryClient],
	)

	const allDishes = useMemo<IDish[]>(
		() => dishesQuery.data?.pages.flatMap(page => page.data) ?? [],
		[dishesQuery.data?.pages],
	)

	return {
		...dishesQuery,
		allDishes,
		refetchDishes,
		dishQuery,
		deleteDishMutation,
		deleteCategoryFromDishMutation,
	}
}
