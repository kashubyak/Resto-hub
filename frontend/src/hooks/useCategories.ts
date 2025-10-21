'use client'

import { CATEGORIES_QUERY_KEY, LIMIT } from '@/constants/query-keys.constant'
import { useAlert } from '@/providers/AlertContext'
import { getCategoriesService } from '@/services/category/get-categories.service'
import type { ICategoryListResponse } from '@/types/category.interface'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'

export const useCategories = (searchQuery?: string) => {
	const queryClient = useQueryClient()
	const { showSuccess, showError } = useAlert()
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

	return {}
}
