'use client'

import { Button } from '@/components/ui/Button'
import { useCallback, useState } from 'react'
import { DishList } from './DishList'
import { DishModal } from './DishModal'

export default function DishesPage() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const openModal = useCallback(() => setIsModalOpen(true), [])
	const closeModal = useCallback(() => setIsModalOpen(false), [])

	return (
		<div>
			<div className='flex justify-between items-center p-4 border-b border-border'>
				<Button
					type='button'
					text='Create new dish'
					onClick={openModal}
					className='w-auto px-6 py-2'
				/>
				<DishModal open={isModalOpen} onClose={closeModal} />
			</div>

			<DishList />
		</div>
	)
}
