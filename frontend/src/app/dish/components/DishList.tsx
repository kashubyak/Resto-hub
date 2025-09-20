'use client'

import { useDishes } from '@/hooks/useDishes'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

export const DishList = () => {
	const {
		allDishes,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
	} = useDishes()

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
		<div className='p-4'>
			<h2 className='text-xl font-bold mb-4'>Dish List</h2>

			<div className='grid gap-4'>
				{allDishes.map(dish => (
					<div
						key={dish.id}
						className='border p-4 rounded-md flex gap-4 items-center bg-secondary'
					>
						<Image
							src={dish.imageUrl}
							alt={dish.name}
							width={96}
							height={96}
							className='w-24 h-24 object-cover rounded-md'
						/>
						<div>
							<h3 className='font-semibold'>{dish.name}</h3>
							<p className='text-sm text-muted-foreground'>{dish.description}</p>
							<p className='mt-1'>💲 {dish.price}</p>
							<p className='text-xs text-muted-foreground'>
								Category: {dish.category?.name ?? '—'}
							</p>
						</div>
					</div>
				))}
			</div>

			<div ref={loaderRef} className='h-10 flex items-center justify-center'>
				{isFetchingNextPage && <span>Loading more...</span>}
			</div>
		</div>
	)
}
