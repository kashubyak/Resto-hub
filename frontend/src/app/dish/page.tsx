'use client'

import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { useState } from 'react'
import { DishList } from './DishList'
import { DishModal } from './DishModal'

export default function DishesPage() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')

	return (
		<div>
			<div className='flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 border-b border-border'>
				<Button
					type='button'
					text='Create new dish'
					onClick={() => setIsModalOpen(true)}
					className='w-full sm:w-auto px-6 py-2'
				/>
				<SearchInput
					onSearch={setSearchQuery}
					placeholder='Search dishes by name...'
					debounceMs={500}
					className='w-full sm:w-64'
				/>
				<DishModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
			</div>
			<DishList searchQuery={searchQuery} />
		</div>
	)
}
