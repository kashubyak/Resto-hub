'use client'

import { NotFound } from '@/components/ui/NotFound'
import { useDishes } from '@/hooks/useDishes'
import { use } from 'react'
import { DishActions } from './components/DishActions'
import { DishDetails } from './components/DishDetails'
import { DishDownInfo } from './components/DishDownInfo'
import { DishImage } from './components/DishImage'
import { DishTopInfo } from './components/DishTopInfo'
import { DishPageSkeleton } from './components/skeleton/DishPageSkeleton'

export default function DishPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params)
	const { dishQuery } = useDishes(Number(id))

	if (dishQuery.isLoading) return <DishPageSkeleton />
	if (dishQuery.isError || !dishQuery.data)
		return (
			<NotFound
				icon='🍽️'
				title='Dish Not Found'
				message='Sorry, we could not load this dish.'
			/>
		)

	const dish = dishQuery.data

	return (
		<div className='min-h-screen bg-background p-3 lg:p-4'>
			<div className='flex flex-col lg:grid lg:grid-cols-3'>
				<DishImage imageUrl={dish.imageUrl} name={dish.name} />
				<div className='lg:col-span-1 flex flex-col'>
					<div className='flex-grow px-4 lg:px-6 lg:pr-0 py-2 space-y-6'>
						<DishTopInfo
							name={dish.name}
							description={dish.description}
							price={dish.price}
							available={dish.available}
							category={dish.category}
						/>
						<div className='space-y-6'>
							<DishDownInfo
								weightGr={dish.weightGr}
								calories={dish.calories}
								ingredients={dish.ingredients}
							/>
							<DishDetails
								id={dish.id}
								categoryId={dish.categoryId}
								createdAt={dish.createdAt}
								updatedAt={dish.updatedAt}
							/>
						</div>
					</div>
					<DishActions id={dish.id} />
				</div>
			</div>
		</div>
	)
}
