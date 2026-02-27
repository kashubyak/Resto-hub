'use client'

import { CategoryEmptyState } from '@/app/category/components/CategoryEmptyState'
import { CategoryNoResults } from '@/app/category/components/CategoryNoResults'
import { NotFound } from '@/components/ui/NotFound'
import { useCategories } from '@/hooks/useCategories'
import type { ICategoryWithDishes } from '@/types/category.interface'
import type { FilterValues } from '@/types/filter.interface'
import { memo, useCallback, useEffect, useRef } from 'react'
import { CategoryCard } from './components/list/CategoryCard'

const CardSkeleton = () => (
	<div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
		<div className="h-32 bg-muted/50 animate-pulse" />
		<div className="p-4 space-y-3">
			<div className="h-5 bg-muted/50 rounded animate-pulse w-3/4" />
			<div className="h-4 bg-muted/50 rounded animate-pulse w-1/2" />
			<div className="h-10 bg-muted/50 rounded-lg animate-pulse" />
		</div>
	</div>
)

interface CategoryListItemProps {
	searchQuery?: string
	filters?: FilterValues
	onOpenCreateModal?: () => void
	onEditClick?: (category: ICategoryWithDishes) => void
	onDeleteClick?: (category: ICategoryWithDishes) => void
	onClearSearch?: () => void
}

const CategoryListItemComponent = ({
	searchQuery = '',
	filters = {},
	onOpenCreateModal,
	onEditClick,
	onDeleteClick,
	onClearSearch,
}: CategoryListItemProps) => {
	const {
		allCategories,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
		refetchCategories,
	} = useCategories(searchQuery, filters)

	const loaderRef = useRef<HTMLDivElement | null>(null)

	const handleIntersection = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			if (entries[0].isIntersecting && hasNextPage) fetchNextPage()
		},
		[hasNextPage, fetchNextPage],
	)

	useEffect(() => {
		if (!allCategories.length) return
		const observer = new IntersectionObserver(handleIntersection, {
			threshold: 1.0,
		})
		const el = loaderRef.current
		if (el) observer.observe(el)
		return () => observer.disconnect()
	}, [handleIntersection, allCategories.length])

	const hasActiveFilters = Object.keys(filters).length > 0

	if (isLoading) {
		return (
			<div className="p-3 sm:p-6">
				<div className="mb-6">
					<h2 className="text-2xl font-bold">Categories</h2>
				</div>
				<div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{[...Array(8)].map((_, i) => (
						<CardSkeleton key={i} />
					))}
				</div>
			</div>
		)
	}

	if (isError)
		return (
			<NotFound
				icon="📁"
				title="Categories Not Found"
				message="Sorry, we could not load the categories."
			/>
		)

	if (!allCategories.length) {
		const hasSearchOrFilters = !!searchQuery || hasActiveFilters
		if (!hasSearchOrFilters && onOpenCreateModal)
			return <CategoryEmptyState onCreateClick={onOpenCreateModal} />
		if (hasSearchOrFilters && onClearSearch)
			return <CategoryNoResults onClearSearch={onClearSearch} />
		return (
			<NotFound
				icon="📁"
				title="No Categories Available"
				message={
					hasSearchOrFilters
						? `No categories found matching your ${searchQuery ? 'search' : 'filters'}`
						: 'Looks like there are no categories yet.'
				}
			/>
		)
	}

	return (
		<div className="p-3 sm:p-6">
			<div className="mb-6">
				<h2 className="text-2xl font-bold">
					Categories
					<span className="text-base font-normal text-muted-foreground ml-2">
						({allCategories.length}{' '}
						{allCategories.length === 1 ? 'item' : 'items'})
					</span>
				</h2>
			</div>

			<div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{allCategories.map((category) => (
					<CategoryCard
						key={category.id}
						category={category}
						refetchCategories={refetchCategories}
						onEditClick={onEditClick}
						onDeleteClick={onDeleteClick}
					/>
				))}
			</div>

			{isFetchingNextPage && (
				<div className="mt-4 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{[...Array(4)].map((_, i) => (
						<CardSkeleton key={i} />
					))}
				</div>
			)}

			<div ref={loaderRef} className="h-1" />
		</div>
	)
}

export const CategoryListItem = memo(CategoryListItemComponent)
