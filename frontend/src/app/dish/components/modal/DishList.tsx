'use client'

import { useDishes } from '@/hooks/useDishes'
import { useEffect, useRef, useState } from 'react'
import { DishCard } from '../list/DishCard'
import { DishListItem } from '../list/DishListItem'
import { ViewModeToggle, type ViewMode } from '../list/ViewModeToggle'

export const DishList = () => {
	const {
		allDishes,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
	} = useDishes()

	const [viewMode, setViewMode] = useState<ViewMode>('grid')
	const loaderRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting && hasNextPage) fetchNextPage()
			},
			{ threshold: 1.0 },
		)

		if (loaderRef.current) observer.observe(loaderRef.current)
		return () => observer.disconnect()
	}, [fetchNextPage, hasNextPage])

	if (isLoading) return <div>Loading...</div>
	if (isError) return <div>Failed to load dishes</div>

	return (
		<div className='p-6'>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-2xl font-bold'>Dish List</h2>
				<ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
			</div>

			{viewMode === 'grid' ? (
				<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
					{allDishes.map(dish => (
						<DishCard key={dish.id} dish={dish} />
					))}
				</div>
			) : (
				<div className='space-y-4'>
					{allDishes.map(dish => (
						<DishListItem key={dish.id} dish={dish} />
					))}
				</div>
			)}

			<div ref={loaderRef} className='h-12 flex items-center justify-center'>
				{isFetchingNextPage && <span>Loading more...</span>}
			</div>
		</div>
	)
}
