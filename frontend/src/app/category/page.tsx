'use client'

import { categoryFilters } from '@/components/elements/Filters/category.filters'
import { FilterDrawer } from '@/components/elements/Filters/FilterDrawer'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import type { FilterValues } from '@/types/filter.interface'
import { useCallback, useState } from 'react'
import { CategoryListItem } from './CategoryListItem'
import { CategoryModal } from './CategoryModal'

export default function CategoryPage() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [filters, setFilters] = useState<FilterValues>({})

	const handleModalOpen = useCallback(() => setIsModalOpen(true), [])
	const handleModalClose = useCallback(() => setIsModalOpen(false), [])

	const handleFilterApply = useCallback((values: FilterValues) => setFilters(values), [])
	const handleFilterReset = useCallback(() => setFilters({}), [])
	const handleSearch = useCallback((value: string) => setSearchQuery(value), [])

	return (
		<div>
			<div className='p-4 sm:p-6 border-b border-border bg-background'>
				<div className='flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch sm:items-center'>
					<div className='sm:flex-shrink-0'>
						<Button
							type='button'
							text='Create new category'
							onClick={handleModalOpen}
							className='!mt-0 w-full sm:w-auto px-6 py-2.5 h-[42px] whitespace-nowrap rounded-lg shadow-sm hover:shadow-md transition-all duration-200'
						/>
					</div>

					<div className='flex-1 flex items-center gap-2 sm:gap-3 min-w-0'>
						<div className='flex-1 min-w-0'>
							<SearchInput
								onSearch={handleSearch}
								placeholder='Search categories...'
								debounceMs={500}
								className='w-full'
							/>
						</div>

						<div className='flex-shrink-0'>
							<FilterDrawer
								filters={categoryFilters}
								initialValues={filters}
								onApply={handleFilterApply}
								onReset={handleFilterReset}
							/>
						</div>
					</div>
				</div>

				<CategoryModal open={isModalOpen} onClose={handleModalClose} />
			</div>
			<CategoryListItem searchQuery={searchQuery} filters={filters} />
		</div>
	)
}
