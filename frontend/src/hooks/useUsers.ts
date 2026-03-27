'use client'

import { LIMIT, USERS_QUERY_KEY } from '@/constants/query-keys.constant'
import { getUserById } from '@/services/user/get-user-by-id.service'
import { getUsers } from '@/services/user/get-users.service'
import type {
	IGetUsersParams,
	IUser,
	IUserListResponse,
	UserListRoleFilter,
} from '@/types/user.interface'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export type UsersSortOption =
	| 'default'
	| 'name-asc'
	| 'name-desc'
	| 'created-newest'
	| 'created-oldest'
	| 'updated-newest'
	| 'updated-oldest'

export interface IUsersListFilters {
	role?: UserListRoleFilter
	sortOption: UsersSortOption
}

function sortOptionToApiParams(
	sortOption: UsersSortOption,
): Pick<IGetUsersParams, 'sortBy' | 'order'> {
	switch (sortOption) {
		case 'name-asc':
			return { sortBy: 'name', order: 'asc' }
		case 'name-desc':
			return { sortBy: 'name', order: 'desc' }
		case 'created-newest':
			return { sortBy: 'createdAt', order: 'desc' }
		case 'created-oldest':
			return { sortBy: 'createdAt', order: 'asc' }
		case 'updated-newest':
			return { sortBy: 'updatedAt', order: 'desc' }
		case 'updated-oldest':
			return { sortBy: 'updatedAt', order: 'asc' }
		default:
			return {}
	}
}

export const useUsers = (
	userId?: number,
	searchQuery?: string,
	filters?: IUsersListFilters,
	listDisabled?: boolean,
) => {
	const normalizedSearchQuery = searchQuery?.trim() ?? undefined
	const sortApi = filters ? sortOptionToApiParams(filters.sortOption) : {}
	const roleFilter = filters?.role

	const filterKey = useMemo(() => {
		if (!filters) return 'no-filters'
		return JSON.stringify({
			role: roleFilter ?? '',
			sortOption: filters.sortOption,
		})
	}, [filters, roleFilter])

	const usersQuery = useInfiniteQuery<IUserListResponse, Error>({
		queryKey: [USERS_QUERY_KEY.ALL, normalizedSearchQuery, filterKey],
		queryFn: async ({ pageParam = 1 }) => {
			const response = await getUsers({
				page: pageParam as number,
				limit: LIMIT,
				...(normalizedSearchQuery && { search: normalizedSearchQuery }),
				...(roleFilter && { role: roleFilter }),
				...sortApi,
			})
			return response.data
		},
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
		initialPageParam: 1,
		enabled: !listDisabled && userId == null,
		staleTime: 30000,
		refetchOnWindowFocus: false,
	})

	const userQuery = useQuery<IUser, Error>({
		queryKey: [USERS_QUERY_KEY.DETAIL, userId],
		queryFn: async () => {
			if (!userId) throw new Error('User ID is required')
			const response = await getUserById(userId)
			return response.data
		},
		enabled: !!userId,
		staleTime: 30000,
		refetchOnWindowFocus: false,
	})

	const allUsers = useMemo<IUser[]>(
		() => usersQuery.data?.pages.flatMap((page) => page.data) ?? [],
		[usersQuery.data?.pages],
	)

	const totalCount = usersQuery.data?.pages[0]?.total ?? 0

	return {
		...usersQuery,
		allUsers,
		totalCount,
		userQuery,
	}
}
