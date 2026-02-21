'use client'

import { useAuth } from '@/providers/AuthContext'
import { getCategoriesService } from '@/services/category/get-categories.service'
import { getAllDishes } from '@/services/dish/get-dishes.service'
import { useQueries } from '@tanstack/react-query'

const IS_NEW_USER_QUERY_KEY = ['dashboard', 'isNewUser'] as const

export function useIsNewUser() {
	const { user } = useAuth()

	const [dishesResult, categoriesResult] = useQueries({
		queries: [
			{
				queryKey: [...IS_NEW_USER_QUERY_KEY, 'dishes'],
				queryFn: async () => {
					const response = await getAllDishes({ limit: 1 })
					return response.data
				},
				enabled: !!user,
				staleTime: 60_000,
			},
			{
				queryKey: [...IS_NEW_USER_QUERY_KEY, 'categories'],
				queryFn: async () => {
					const response = await getCategoriesService({ limit: 1 })
					return response.data
				},
				enabled: !!user,
				staleTime: 60_000,
			},
		],
	})

	const isLoading =
		(dishesResult.isLoading || categoriesResult.isLoading) && !!user
	const dishesTotal = dishesResult.data?.total ?? 0
	const categoriesTotal = categoriesResult.data?.total ?? 0
	const isNewUser =
		!isLoading &&
		!!user &&
		dishesResult.isSuccess &&
		categoriesResult.isSuccess &&
		dishesTotal === 0 &&
		categoriesTotal === 0

	return { isNewUser, isLoading }
}
