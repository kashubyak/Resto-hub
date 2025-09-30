'use client'

import { ROUTES } from '@/constants/pages.constant'
import { DISHES_QUERY_KEY } from '@/constants/query-keys.constant'
import { deleteDish } from '@/services/dish/delete-dish.service'
import { getDish } from '@/services/dish/get-dish.service'
import { getAllDishes } from '@/services/dish/get-dishes.service'
import { useAlertStore } from '@/store/alert.store'
import type { IDish, IDishResponse } from '@/types/dish.interface'
import type { IAxiosError } from '@/types/error.interface'
import { parseBackendError } from '@/utils/errorHandler'
import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

const LIMIT = 10

export const useDishes = (dishId?: number) => {
	const queryClient = useQueryClient()
	const router = useRouter()
	const { setPendingAlert } = useAlertStore()

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

	const deleteDishMutation = useMutation({
		mutationFn: (id: number) => deleteDish(id),
		onSuccess: () => {
			setPendingAlert({
				severity: 'success',
				text: 'Dish deleted successfully',
			})
			queryClient.invalidateQueries({ queryKey: [DISHES_QUERY_KEY.ALL] })
			router.push(ROUTES.PRIVATE.ADMIN.DISH)
		},
		onError: (err: unknown) => {
			setPendingAlert({
				severity: 'error',
				text: parseBackendError(err as IAxiosError).join('\n'),
			})
		},
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
		deleteDishMutation,
	}
}
