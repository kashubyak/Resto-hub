'use client'

import { NotFound } from '@/components/ui/NotFound'
import { ViewModeToggle, type ViewMode } from '@/components/ui/ViewModeToggle'
import { useCategories } from '@/hooks/useCategories'
import type { FilterValues } from '@/types/filter.interface'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { CategoryCard } from './components/list/CategoryCard'
import { CategoryRowItem } from './components/list/CategoryRowItem'

const CardSkeleton = () => (
	<div className='h-[200px] bg-muted/50 border border-border rounded-xl animate-pulse' />
)
const RowSkeleton = () => (
	<div className='h-[80px] bg-muted/50 border border-border rounded-lg animate-pulse' />
)

interface CategoryListItemProps {
	searchQuery?: string
	filters?: FilterValues
}

const CategoryListItemComponent = ({
	searchQuery = '',
	filters = {},
}: CategoryListItemProps) => {
	const {
		allCategories,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
	} = useCategories()

	const [viewMode, setViewMode] = useState<ViewMode>('grid')
	const loaderRef = useRef<HTMLDivElement | null>(null)

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

	if (isLoading) {
		return (
			<div className='p-3 sm:p-6'>
				<div className='flex justify-between items-center mb-6'>
					<h2 className='text-2xl font-bold'>Categories</h2>
					<ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
				</div>

				{viewMode === 'grid' ? (
					<div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
						{[...Array(8)].map((_, i) => (
							<CardSkeleton key={i} />
						))}
					</div>
				) : (
					<div className='space-y-3'>
						{[...Array(8)].map((_, i) => (
							<RowSkeleton key={i} />
						))}
					</div>
				)}
			</div>
		)
	}

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
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-2xl font-bold'>
					Categories
					<span className='text-base font-normal text-muted-foreground ml-2'>
						({allCategories.length} {allCategories.length === 1 ? 'item' : 'items'})
					</span>
				</h2>
				<ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
			</div>

			{viewMode === 'grid' ? (
				<div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
					{allCategories.map(category => (
						<CategoryCard key={category.id} category={category} />
					))}
				</div>
			) : (
				<div className='space-y-3'>
					{allCategories.map(category => (
						<CategoryRowItem key={category.id} category={category} />
					))}
				</div>
			)}

			{isFetchingNextPage && (
				<div
					className={`mt-4 ${
						viewMode === 'grid'
							? 'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
							: 'space-y-3'
					}`}
				>
					{[...Array(4)].map((_, i) =>
						viewMode === 'grid' ? <CardSkeleton key={i} /> : <RowSkeleton key={i} />,
					)}
				</div>
			)}

			<div ref={loaderRef} className='h-1' />
		</div>
	)
}

export const CategoryListItem = memo(CategoryListItemComponent)
