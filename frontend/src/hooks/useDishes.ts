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
import type { FilterValues } from '@/types/filter.interface'
import { parseBackendError } from '@/utils/errorHandler'
import {
	QueryClient,
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
	type InfiniteData,
} from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'

const LIMIT = 10

export const useDishes = (
	dishId?: number,
	searchQuery?: string,
	filters?: FilterValues,
) => {
	const queryClient = useQueryClient()
	const router = useRouter()
	const { showSuccess, showError } = useAlert()
	const normalizedSearchQuery = searchQuery?.trim() || undefined
	const filterKey = useMemo(() => {
		if (!filters || Object.keys(filters).length === 0) return 'no-filters'
		return JSON.stringify(filters)
	}, [filters])

	const updateDishCache = useCallback(
		(
			queryClient: QueryClient,
			updatedDish: IDish,
			searchKey?: string,
			filterKey?: string,
		) => {
			queryClient.setQueryData<IDish>(
				[DISHES_QUERY_KEY.DETAIL, updatedDish.id],
				updatedDish,
			)
			queryClient.setQueryData<InfiniteData<IDishListResponse>>(
				[DISHES_QUERY_KEY.ALL, searchKey, filterKey],
				oldData => {
					if (!oldData) return oldData
					return {
						...oldData,
						pages: oldData.pages.map(page => ({
							...page,
							data: page.data.map(dish =>
								dish.id === updatedDish.id ? updatedDish : dish,
							),
						})),
					}
				},
			)
		},
		[],
	)

	const dishesQuery = useInfiniteQuery<IDishListResponse, Error>({
		queryKey: [DISHES_QUERY_KEY.ALL, normalizedSearchQuery, filterKey],
		queryFn: async ({ pageParam = 1 }) => {
			const response = await getAllDishes({
				page: pageParam as number,
				limit: LIMIT,
				...(normalizedSearchQuery && { search: normalizedSearchQuery }),
				...filters,
			})
			return response.data
		},
		getNextPageParam: lastPage =>
			lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
		initialPageParam: 1,
		enabled: !dishId,
		staleTime: 30000,
		refetchOnWindowFocus: false,
	})

	const dishQuery = useQuery<IDish, Error>({
		queryKey: [DISHES_QUERY_KEY.DETAIL, dishId],
		queryFn: async () => {
			const response = await getDish(dishId!)
			return response.data
		},
		enabled: !!dishId,
		staleTime: 30000,
		refetchOnWindowFocus: false,
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
			updateDishCache(queryClient, updatedDish, normalizedSearchQuery, filterKey)
		},
		[showSuccess, updateDishCache, queryClient, normalizedSearchQuery, filterKey],
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
		updateDishCache,
		dishQuery,
		deleteDishMutation,
		deleteCategoryFromDishMutation,
	}
}
