'use client'

import { Loading } from '@/components/ui/Loading'
import { NotFound } from '@/components/ui/NotFound'
import { useDishes } from '@/hooks/useDishes'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import { useEffect, useRef, useState } from 'react'
import { DishCard } from './components/list/DishCard'
import { DishListItem } from './components/list/DishListItem'
import { ViewModeToggle, type ViewMode } from './components/list/ViewModeToggle'

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

	if (isLoading) return <Loading />
	if (isError)
		return (
			<NotFound
				icon={<RestaurantMenuIcon />}
				title='Dishes Not Found'
				message='Sorry, we could not load these dishes.'
			/>
		)

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
				{isFetchingNextPage && (
					<div className='flex items-center justify-center'>
						<div className='animate-spin rounded-full h-8 w-8 border-4 border-[var(--primary)] border-t-transparent' />
					</div>
				)}
			</div>
		</div>
	)
}
