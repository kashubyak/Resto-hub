'use client'

import { DISHES_QUERY_KEY } from '@/constants/query-keys.constant'
import { getDish } from '@/services/dish/get-dish.service'
import { getAllDishes } from '@/services/dish/get-dishes.service'
import type { IDish, IDishResponse } from '@/types/dish.interface'
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query'

const LIMIT = 10

export const useDishes = (dishId?: number) => {
	const queryClient = useQueryClient()

	const dishesQuery = useInfiniteQuery<IDishResponse, Error>({
		queryKey: [DISHES_QUERY_KEY.ALL],
		queryFn: ({ pageParam }) => getAllDishes((pageParam as number) ?? 1, LIMIT),
		getNextPageParam: lastPage =>
			lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
		initialPageParam: 1,
		enabled: !dishId,
	})

	const dishQuery = useQuery<IDish, Error>({
		queryKey: [DISHES_QUERY_KEY.DETAIL, dishId],
		queryFn: () => getDish(dishId!),
		enabled: !!dishId,
	})

	const refetchDishes = () => {
		queryClient.invalidateQueries({ queryKey: [DISHES_QUERY_KEY.ALL] })
	}

	const allDishes: IDish[] = dishesQuery.data?.pages.flatMap(page => page.data) ?? []

	return {
		...dishesQuery,
		allDishes,
		refetchDishes,
		dishQuery,
	}
}
