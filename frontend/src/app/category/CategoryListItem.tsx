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

	return <div>Category List Item</div>
}
export const CategoryListItem = memo(CategoryListItemComponent)
