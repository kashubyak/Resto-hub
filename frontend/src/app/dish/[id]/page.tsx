'use client'
import { Button } from '@/components/ui/Button'
import { Loading } from '@/components/ui/Loading'
import { NotFound } from '@/components/ui/NotFound'
import { useDishes } from '@/hooks/useDishes'
import {
	Cancel,
	Category,
	CheckCircle,
	Delete,
	Edit,
	LocalOffer,
	RemoveCircle,
	Restaurant,
} from '@mui/icons-material'
import Image from 'next/image'
import { use } from 'react'

export default function DishPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params)
	const { dishQuery } = useDishes(Number(id))

	if (dishQuery.isLoading) return <Loading title='Loading dish details...' />

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
		<div className='min-h-screen bg-background'>
			<div className='flex flex-col lg:grid lg:grid-cols-3 min-h-screen'>
				{/* Image Section - Wider for 16:9 aspect ratio */}
				<div className='lg:col-span-2 relative bg-muted flex items-center justify-center lg:sticky lg:top-0 lg:h-screen'>
					<div className='w-full h-[50vh] lg:h-[70vh] max-w-7xl relative'>
						<Image
							src={dish.imageUrl}
							alt={dish.name}
							fill
							className='object-contain'
							priority
							sizes='(max-width: 1024px) 100vw, 66vw'
						/>

						{/* Status Badge */}
						<div className='absolute top-6 left-6'>
							<div
								className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${
									dish.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
								}`}
							>
								{dish.available ? (
									<>
										<CheckCircle className='w-4 h-4 mr-2' />
										Available
									</>
								) : (
									<>
										<Cancel className='w-4 h-4 mr-2' />
										Unavailable
									</>
								)}
							</div>
						</div>

						{/* Category Badge */}
						{dish.category && (
							<div className='absolute top-6 right-6'>
								<div className='inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-primary text-primary-foreground shadow-lg'>
									<LocalOffer className='w-4 h-4 mr-2' />
									{dish.category.name}
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Content Section - More compact for 16:9 layout */}
				<div className='lg:col-span-1 flex flex-col'>
					{/* Product Info */}
					<div className='flex-grow px-6 lg:px-8 py-6 lg:py-8 space-y-6'>
						{/* Header */}
						<div className='space-y-4'>
							<h1 className='text-3xl lg:text-4xl font-bold text-foreground leading-tight'>
								{dish.name}
							</h1>
							<div className='text-3xl lg:text-4xl font-bold text-primary'>
								${dish.price}
							</div>
							<p className='text-base lg:text-lg text-muted-foreground leading-relaxed'>
								{dish.description}
							</p>
						</div>

						{/* Product Details */}
						<div className='space-y-6'>
							{/* Stats */}
							<div className='grid grid-cols-2 gap-4'>
								<div className='text-center'>
									<div className='text-2xl font-bold text-foreground mb-1'>
										{dish.weightGr ? `${dish.weightGr}g` : '—'}
									</div>
									<div className='text-xs text-muted-foreground uppercase tracking-wider'>
										Weight
									</div>
								</div>
								<div className='text-center'>
									<div className='text-2xl font-bold text-foreground mb-1'>
										{dish.calories ? `${dish.calories}` : '—'}
									</div>
									<div className='text-xs text-muted-foreground uppercase tracking-wider'>
										Calories
									</div>
								</div>
							</div>

							{/* Ingredients */}
							{dish.ingredients && dish.ingredients.length > 0 && (
								<div className='space-y-3'>
									<h3 className='text-lg font-semibold text-foreground flex items-center'>
										<Restaurant className='w-4 h-4 mr-2 text-primary' />
										Ingredients
									</h3>
									<div className='flex flex-wrap gap-2'>
										{dish.ingredients.map((ingredient, index) => (
											<span
												key={index}
												className='px-3 py-1 bg-muted text-foreground rounded-full text-sm font-medium hover:bg-muted/80 transition-colors'
											>
												{ingredient}
											</span>
										))}
									</div>
								</div>
							)}

							{/* Meta Information */}
							<div className='space-y-3 pt-4'>
								<h3 className='text-lg font-semibold text-foreground'>Details</h3>
								<div className='space-y-2 text-sm'>
									<div className='flex justify-between'>
										<span className='text-muted-foreground'>Dish ID</span>
										<span className='font-medium text-foreground'>#{dish.id}</span>
									</div>
									<div className='flex justify-between'>
										<span className='text-muted-foreground'>Category ID</span>
										<span className='font-medium text-foreground'>
											#{dish.categoryId}
										</span>
									</div>
									<div className='flex justify-between'>
										<span className='text-muted-foreground'>Created</span>
										<span className='font-medium text-foreground'>
											{new Date(dish.createdAt).toLocaleDateString('en-US', {
												year: 'numeric',
												month: 'long',
												day: 'numeric',
											})}
										</span>
									</div>
									<div className='flex justify-between'>
										<span className='text-muted-foreground'>Last Updated</span>
										<span className='font-medium text-foreground'>
											{new Date(dish.updatedAt).toLocaleDateString('en-US', {
												year: 'numeric',
												month: 'long',
												day: 'numeric',
											})}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className='px-6 lg:px-8 py-6 bg-muted/30'>
						<div className='space-y-4'>
							<h3 className='text-base font-semibold text-foreground mb-4'>Actions</h3>
							<div className='grid grid-cols-1 gap-3'>
								<Button
									className='inline-flex items-center justify-center h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium'
									onClick={() => console.log('Update dish')}
								>
									<Edit className='w-4 h-4 mr-2' />
									Update Dish
								</Button>

								<Button
									className='inline-flex items-center justify-center h-10 bg-blue-500 hover:bg-blue-600 text-white font-medium'
									onClick={() => console.log('Assign category')}
								>
									<Category className='w-4 h-4 mr-2' />
									Assign Category
								</Button>

								<Button
									className='inline-flex items-center justify-center h-10 bg-orange-500 hover:bg-orange-600 text-white font-medium'
									onClick={() => console.log('Remove category')}
								>
									<RemoveCircle className='w-4 h-4 mr-2' />
									Remove Category
								</Button>

								<Button
									className='inline-flex items-center justify-center h-10 bg-red-500 hover:bg-red-600 text-white font-medium'
									onClick={() => console.log('Delete dish')}
								>
									<Delete className='w-4 h-4 mr-2' />
									Delete Dish
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
