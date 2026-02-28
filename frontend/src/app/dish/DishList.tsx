'use client'

import { DishNoResultsEmptyState } from '@/app/dish/DishNoResultsEmptyState'
import { NotFound } from '@/components/ui/NotFound'
import { useDishes } from '@/hooks/useDishes'
import type { FilterValues } from '@/types/filter.interface'
import { memo, useCallback, useEffect, useRef } from 'react'
import type { ViewMode } from '@/components/ui/ViewModeToggle'
import { DishCard } from './components/list/DishCard'
import { DishListItem } from './components/list/DishListItem'
import { DishCardSkeleton } from './components/list/skeleton/DishCardSkeleton'
import { DishListItemSkeleton } from './components/list/skeleton/DishListItemSkeleton'

interface DishListProps {
	searchQuery?: string
	filters?: FilterValues
	viewMode: ViewMode
	onClearSearchAndFilters?: () => void
	onCreateDish?: () => void
}

const DishListComponent: React.FC<DishListProps> = ({
	searchQuery = '',
	filters = {},
	viewMode,
	onClearSearchAndFilters,
	onCreateDish,
}) => {
	const {
		allDishes,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
	} = useDishes(undefined, searchQuery, filters)

	const loaderRef = useRef<HTMLDivElement | null>(null)

	const handleIntersection = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const entry = entries[0]
			if (entry?.isIntersecting && hasNextPage) void fetchNextPage()
		},
		[fetchNextPage, hasNextPage],
	)

	useEffect(() => {
		const observer = new IntersectionObserver(handleIntersection, {
			threshold: 1.0,
		})
		if (loaderRef.current) observer.observe(loaderRef.current)
		return () => observer.disconnect()
	}, [handleIntersection])

	const hasActiveFilters = Object.keys(filters).length > 0

	if (isLoading) {
		return viewMode === 'grid' ? (
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
				{[...Array(8)].map((_, i) => (
					<DishCardSkeleton key={i} />
				))}
			</div>
		) : (
			<div className="space-y-4">
				{[...Array(6)].map((_, i) => (
					<DishListItemSkeleton key={i} />
				))}
			</div>
		)
	}

	if (isError)
		return (
			<NotFound
				icon="🍽️"
				title="Dishes Not Found"
				message="Sorry, we could not load these dishes."
			/>
		)

	if (!allDishes.length)
		return onClearSearchAndFilters && onCreateDish ? (
			<DishNoResultsEmptyState
				hasSearchOrFilters={!!(searchQuery || hasActiveFilters)}
				onClearFilters={onClearSearchAndFilters}
				onCreateDish={onCreateDish}
			/>
		) : (
			<NotFound
				icon="🍽️"
				title="No Dishes Available"
				message={
					searchQuery || hasActiveFilters
						? `No dishes found matching your ${searchQuery ? 'search' : 'filters'}`
						: 'Looks like there are no dishes yet.'
				}
			/>
		)

	return (
		<>
			{viewMode === 'grid' ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
					{allDishes.map((dish) => (
						<DishCard key={dish.id} dish={dish} />
					))}
				</div>
			) : (
				<div className="space-y-4">
					{allDishes.map((dish) => (
						<DishListItem key={dish.id} dish={dish} />
					))}
				</div>
			)}

			{isFetchingNextPage && (
				<>
					{viewMode === 'grid' ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
							{[...Array(4)].map((_, i) => (
								<DishCardSkeleton key={i} />
							))}
						</div>
					) : (
						<div className="space-y-4 mt-4">
							{[...Array(3)].map((_, i) => (
								<DishListItemSkeleton key={i} />
							))}
						</div>
					)}
				</>
			)}

			<div ref={loaderRef} className="h-1" />
		</>
	)
}

export const DishList = memo(DishListComponent)
