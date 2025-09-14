'use client'

import { AuthButton } from '@/components/ui/AuthButton'
import { useState } from 'react'
import { DishModal } from './DishModal'

export default function DishesPage() {
	const [isModalOpen, setIsModalOpen] = useState(false)

	return (
		<div className='flex justify-between items-center p-4 border-b'>
			<AuthButton
				type='button'
				text='Create new dish'
				onClick={() => setIsModalOpen(true)}
				className='w-auto px-6 py-2'
			/>

			<DishModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
		</div>
	)
}
