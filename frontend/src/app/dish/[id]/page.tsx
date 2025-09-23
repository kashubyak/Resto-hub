'use client'

import { useDishes } from '@/hooks/useDishes'
import Image from 'next/image'
import { use } from 'react'

export default function DishPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params)
	const { dishQuery } = useDishes(Number(id))

	if (dishQuery.isLoading) return <p>Loading...</p>
	if (dishQuery.isError || !dishQuery.data) return <p>Помилка завантаження</p>

	const dish = dishQuery.data

	return (
		<div className='p-6'>
			<h1 className='text-2xl font-bold mb-4'>{dish.name}</h1>
			<Image
				src={dish.imageUrl}
				alt={dish.name}
				width={600}
				height={400}
				className='max-w-md rounded-lg shadow mb-4'
			/>
			<p className='text-muted-foreground mb-4'>{dish.description}</p>
			<p className='text-lg font-semibold text-primary'>${dish.price}</p>
		</div>
	)
}
