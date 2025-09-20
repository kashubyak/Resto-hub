'use client'

import { DISHES_QUERY_KEY } from '@/constants/query-keys.constant'
import { getAllDishes } from '@/services/dish/get-dishes.service'
import type { IDish, IDishResponse } from '@/types/dish.interface'
import {
	type InfiniteData,
	useInfiniteQuery,
	useQueryClient,
} from '@tanstack/react-query'

const LIMIT = 10

export const useDishes = () => {
	const queryClient = useQueryClient()

	const dishesQuery = useInfiniteQuery<IDishResponse, Error>({
		queryKey: [DISHES_QUERY_KEY.ALL],
		queryFn: ({ pageParam }) => getAllDishes((pageParam as number) ?? 1, LIMIT),
		getNextPageParam: lastPage =>
			lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
		initialPageParam: 1,
	})

	const refetchDishes = () => {
		queryClient.invalidateQueries({ queryKey: [DISHES_QUERY_KEY.ALL] })
	}

	const addDishToCache = (newDish: IDish) => {
		queryClient.setQueryData<InfiniteData<IDishResponse>>(
			[DISHES_QUERY_KEY.ALL],
			oldData => {
				if (!oldData) return oldData
				return {
					...oldData,
					pages: [
						{
							...oldData.pages[0],
							data: [newDish, ...oldData.pages[0].data],
						},
						...oldData.pages.slice(1),
					],
				}
			},
		)
	}

	const allDishes: IDish[] = dishesQuery.data?.pages.flatMap(page => page.data) ?? []

	return {
		...dishesQuery,
		allDishes,
		refetchDishes,
		addDishToCache,
	}
}
