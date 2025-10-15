'use client'

import { Loading } from '@/components/ui/Loading'
import { NotFound } from '@/components/ui/NotFound'
import { useDishes } from '@/hooks/useDishes'
import type { FilterValues } from '@/types/filter.interface'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { DishCard } from './components/list/DishCard'
import { DishListItem } from './components/list/DishListItem'
import { ViewModeToggle, type ViewMode } from './components/list/ViewModeToggle'

interface DishListProps {
	searchQuery?: string
	filters?: FilterValues
}

const DishListComponent: React.FC<DishListProps> = ({
	searchQuery = '',
	filters = {},
}) => {
	const {
		allDishes,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
	} = useDishes(undefined, searchQuery, filters)

	const [viewMode, setViewMode] = useState<ViewMode>('grid')
	const loaderRef = useRef<HTMLDivElement | null>(null)

	const handleIntersection = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			if (entries[0].isIntersecting && hasNextPage) fetchNextPage()
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

	if (isLoading) return <Loading />
	if (isError)
		return (
			<NotFound
				icon='🍽️'
				title='Dishes Not Found'
				message='Sorry, we could not load these dishes.'
			/>
		)

	const hasActiveFilters = Object.keys(filters).length > 0

	if (!allDishes.length)
		return (
			<NotFound
				icon='🍽️'
				title='No Dishes Available'
				message={
					searchQuery || hasActiveFilters
						? `No dishes found matching your ${searchQuery ? 'search' : 'filters'}`
						: 'Looks like there are no dishes yet.'
				}
			/>
		)

	return (
		<div className='p-3 sm:p-6'>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-2xl font-bold'>
					Dish List
					{(searchQuery || hasActiveFilters) && (
						<span className='text-base font-normal text-secondary-foreground ml-2'>
							({allDishes.length} {allDishes.length === 1 ? 'result' : 'results'})
						</span>
					)}
				</h2>
				<ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
			</div>

			{viewMode === 'grid' ? (
				<div className='grid gap-3 grid-cols-[repeat(auto-fit,minmax(320px,1fr))] justify-center'>
					{allDishes.map(dish => (
						<div key={dish.id} className='max-w-[600px] w-full'>
							<DishCard dish={dish} />
						</div>
					))}
				</div>
			) : (
				<div className='space-y-3'>
					{allDishes.map(dish => (
						<DishListItem key={dish.id} dish={dish} />
					))}
				</div>
			)}

			<div
				ref={loaderRef}
				className={isFetchingNextPage ? 'h-12 flex items-center justify-center' : 'h-1'}
			>
				{isFetchingNextPage && (
					<div className='animate-spin rounded-full h-8 w-8 border-4 border-[var(--primary)] border-t-transparent' />
				)}
			</div>
		</div>
	)
}

export const DishList = memo(DishListComponent)
