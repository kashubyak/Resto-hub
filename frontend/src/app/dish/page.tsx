'use client'

import { AuthButton } from '@/components/ui/AuthButton'
import { useState } from 'react'

export default function DishesPage() {
	const [isModalOpen, setIsModalOpen] = useState(false)

	const handleOpenModal = () => {
		console.log('Open modal');
		
		setIsModalOpen(true)
	}

	return (
		<div className='flex justify-between items-center p-4 border-b'>
			<AuthButton
				type='button'
				text='Add Dish'
				onClick={handleOpenModal}
				className='w-auto px-6 py-2'
			/>
		</div>
	)
}
