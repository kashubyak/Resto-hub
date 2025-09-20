'use client'

import { Button } from '@/components/ui/Button'
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
		<div className='p-6'>
			<h2 className='text-2xl font-bold mb-6'>Dish List</h2>

			<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
				{allDishes.map(dish => (
					<div
						key={dish.id}
						className='bg-card rounded-xl shadow-sm hover:shadow-md transition flex flex-col overflow-hidden'
					>
						<div className='bg-muted flex justify-center items-center p-2'>
							<Image
								src={dish.imageUrl}
								alt={dish.name}
								width={240}
								height={240}
								className='max-h-[200px] w-auto object-contain rounded-lg'
							/>
						</div>
						<div className='p-4 flex flex-col gap-2 flex-grow'>
							<h3 className='text-lg font-semibold'>{dish.name}</h3>
							<p className='text-sm text-muted-foreground line-clamp-2'>
								{dish.description}
							</p>
							<p className='text-base font-medium mt-1'>{dish.price}$</p>
							<p className='text-xs text-muted-foreground'>
								Category: {dish.category?.name ?? '—'}
							</p>

							<div className='mt-auto pt-3'>
								<Button
									type='submit'
									onClick={() => {}}
									text='More details'
									className='w-full'
								/>
							</div>
						</div>
					</div>
				))}
			</div>

			<div ref={loaderRef} className='h-12 flex items-center justify-center'>
				{isFetchingNextPage && <span>Loading more...</span>}
			</div>
		</div>
	)
}
