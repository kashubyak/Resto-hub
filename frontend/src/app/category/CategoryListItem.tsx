'use client'

import { NotFound } from '@/components/ui/NotFound'
import { useCategories } from '@/hooks/useCategories'
import { memo, useCallback, useEffect, useRef } from 'react'

const CategoryListItemComponent = () => {
	const {
		allCategories,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
	} = useCategories()
	const loaderRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		console.log(allCategories)
	}, [allCategories])

	const handleIntersection = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			if (entries[0].isIntersecting && hasNextPage) fetchNextPage()
		},
		[hasNextPage, fetchNextPage],
	)

	useEffect(() => {
		const observer = new IntersectionObserver(handleIntersection, {
			threshold: 1.0,
		})
		if (loaderRef.current) observer.observe(loaderRef.current)
		return () => observer.disconnect()
	}, [handleIntersection])

	if (isError)
		return (
			<NotFound
				icon='📁'
				title='Categories Not Found'
				message='Sorry, we could not load the categories.'
			/>
		)

	if (!allCategories.length)
		return (
			<NotFound
				icon='📁'
				title='No Categories Available'
				message='Looks like there are no categories yet.'
			/>
		)

	return (
		<div className='p-3 sm:p-6'>
			<h2 className='text-2xl font-bold mb-6'>
				Categories
				<span className='text-base font-normal text-muted-foreground ml-2'>
					({allCategories.length} {allCategories.length === 1 ? 'category' : 'categories'}
					)
				</span>
			</h2>

			<div className='space-y-3'>
				{allCategories.map(category => (
					<div
						key={category.id}
						className='bg-background border border-border rounded-lg p-4 hover:shadow-md transition-shadow'
					>
						<div className='flex justify-between items-start'>
							<div>
								<h3 className='text-lg font-semibold'>{category.name}</h3>
								<p className='text-sm text-muted-foreground mt-1'>
									{category.dishes?.length || 0} dishes
								</p>
							</div>
							<span className='text-xs text-muted-foreground'>ID: {category.id}</span>
						</div>
					</div>
				))}
			</div>

			{isFetchingNextPage && (
				<div className='space-y-3 mt-3'>
					{[...Array(3)].map((_, i) => (
						<div key={i} className='h-24 bg-muted rounded-lg animate-pulse' />
					))}
				</div>
			)}

			<div ref={loaderRef} className='h-1' />
		</div>
	)
}
export const CategoryListItem = memo(CategoryListItemComponent)
