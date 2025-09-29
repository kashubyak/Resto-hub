'use client'
import { ViewableImage } from '@/components/ImageViewer/ViewableImage'
import { Button } from '@/components/ui/Button'
import { Loading } from '@/components/ui/Loading'
import { NotFound } from '@/components/ui/NotFound'
import { useDishes } from '@/hooks/useDishes'
import { Category, Delete, Edit, RemoveCircle, Restaurant } from '@mui/icons-material'
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
		<div className='min-h-screen bg-background p-3 lg:p-4'>
			<div className='flex flex-col lg:grid lg:grid-cols-3'>
				<div className='lg:col-span-2 relative flex items-center justify-center lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:self-start'>
					<div className='relative w-full max-w-7xl'>
						<div className='relative w-full aspect-[4/3] lg:h-[70vh]'>
							<ViewableImage
								src={dish.imageUrl}
								alt={dish.name}
								fill
								className='object-contain'
								priority
								sizes='(max-width: 1024px) 100vw, 66vw'
							/>
						</div>
					</div>
				</div>

				<div className='lg:col-span-1 flex flex-col'>
					<div className='flex-grow px-4 lg:px-6 lg:pr-0 py-2 space-y-6'>
						<div className='space-y-3'>
							<h1 className='text-3xl lg:text-4xl font-bold text-foreground leading-tight'>
								{dish.name}
							</h1>
							<div className='text-3xl lg:text-3xl font-bold text-primary'>
								${dish.price}
							</div>
							<div className='flex items-center gap-3 flex-wrap'>
								<span
									className={`px-2 py-1 text-xs font-medium rounded-full stable-light ${
										dish.available ? 'bg-success' : 'bg-destructive'
									}`}
								>
									{dish.available ? 'Available' : 'Unavailable'}
								</span>
								{dish.category && (
									<span className='px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full'>
										{dish.category.name}
									</span>
								)}
								<p className='text-base lg:text-lg text-muted-foreground leading-relaxed'>
									{dish.description}
								</p>
							</div>
						</div>

						<div className='space-y-6'>
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
												className='px-3 py-1 active-item text-foreground rounded-full text-sm font-medium hover:bg-muted/80 transition-colors'
											>
												{ingredient}
											</span>
										))}
									</div>
								</div>
							)}

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

					<div className='px-4 lg:px-6 lg:pr-0 py-6 bg-muted/30'>
						<div className='space-y-4'>
							<h3 className='text-base font-semibold text-foreground mb-4'>Actions</h3>
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2'>
								<Button
									className='h-10 inline-flex items-center justify-center font-semibold'
									onClick={() => console.log('Update dish')}
								>
									<Edit className='w-4 h-4 mr-2' />
									Update Dish
								</Button>
								<Button
									className='h-10 inline-flex items-center justify-center font-semibold'
									onClick={() => console.log('Assign category')}
								>
									<Category className='w-4 h-4 mr-2' />
									Assign Category
								</Button>
								<Button
									className='h-10 inline-flex items-center justify-center font-semibold'
									onClick={() => console.log('Remove category')}
								>
									<RemoveCircle className='w-4 h-4 mr-2' />
									Remove Category
								</Button>
								<Button
									className='h-10 inline-flex items-center justify-center font-semibold'
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
