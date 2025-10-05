'use client'

import { dishFilters } from '@/components/elements/Filters/dish.filters'
import { Button } from '@/components/ui/Button'
import { FilterDrawer } from '@/components/ui/FilterDrawer'
import { SearchInput } from '@/components/ui/SearchInput'
import type { FilterValues } from '@/types/filter.interface'
import { useState } from 'react'
import { DishList } from './DishList'
import { DishModal } from './DishModal'

export default function DishesPage() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [filters, setFilters] = useState<FilterValues>({})

	const handleFilterApply = (values: FilterValues) => {
		setFilters(values)
	}

	const handleFilterReset = () => {
		setFilters({})
	}

	return (
		<div>
			<div className='flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 border-b border-border'>
				<Button
					type='button'
					text='Create new dish'
					onClick={() => setIsModalOpen(true)}
					className='w-full sm:w-auto px-6 py-2'
				/>

				<div className='flex items-center gap-2 w-full sm:w-auto'>
					<SearchInput
						onSearch={setSearchQuery}
						placeholder='Search dishes by name...'
						debounceMs={500}
						className='w-full sm:w-64'
					/>
					<FilterDrawer
						filters={dishFilters}
						initialValues={filters}
						onApply={handleFilterApply}
						onReset={handleFilterReset}
					/>
				</div>

				<DishModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
			</div>

			<DishList searchQuery={searchQuery} filters={filters} />
		</div>
	)
}
