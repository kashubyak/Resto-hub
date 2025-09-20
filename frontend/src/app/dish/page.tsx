'use client'

import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import { DishModal } from './DishModal'
import { DishList } from './components/modal/DishList'

export default function DishesPage() {
	const [isModalOpen, setIsModalOpen] = useState(false)

	return (
		<div>
			<div className='flex justify-between items-center p-4 border-b border-border'>
				<Button
					type='button'
					text='Create new dish'
					onClick={() => setIsModalOpen(true)}
					className='w-auto px-6 py-2'
				/>
				<DishModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
			</div>

			<DishList />
		</div>
	)
}
