'use client'

import { CATEGORIES_QUERY_KEY, LIMIT } from '@/constants/query-keys.constant'
import { getCategoriesService } from '@/services/category/get-categories.service'
import type {
	ICategoryListResponse,
	ICategoryWithDishes,
} from '@/types/category.interface'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'

export const useCategories = (searchQuery?: string) => {
	const queryClient = useQueryClient()
	// const { showSuccess, showError } = useAlert()
	const normalizedSearchQuery = searchQuery?.trim() || undefined

	const categoriesQuery = useInfiniteQuery<ICategoryListResponse, Error>({
		queryKey: [CATEGORIES_QUERY_KEY.ALL, normalizedSearchQuery],
		queryFn: async ({ pageParam = 1 }) => {
			const response = await getCategoriesService({
				page: pageParam as number,
				limit: LIMIT,
				...(normalizedSearchQuery && { search: normalizedSearchQuery }),
			})
			return response.data
		},
		getNextPageParam: lastPage =>
			lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
		initialPageParam: 1,
		staleTime: 30000,
		refetchOnWindowFocus: false,
	})

	const refetchCategories = useCallback(() => {
		queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY.ALL] })
	}, [queryClient])

	const allCategories = useMemo<ICategoryWithDishes[]>(
		() => categoriesQuery.data?.pages.flatMap(page => page.data) ?? [],
		[categoriesQuery.data?.pages],
	)

	return {
		...categoriesQuery,
		allCategories,
		refetchCategories,
	}
}
