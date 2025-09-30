import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/pages.constant'
import type { IDish } from '@/types/dish.interface'
import Image from 'next/image'
import Link from 'next/link'

interface DishListItemProps {
	dish: IDish
}

export const DishListItem: React.FC<DishListItemProps> = ({ dish }) => {
	return (
		<div className='bg-background border border-border rounded-md shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group'>
			<div className='flex flex-col md:flex-row'>
				<div className='relative w-full md:w-72 lg:w-80 flex-shrink-0'>
					<Image
						src={dish.imageUrl}
						alt={dish.name}
						width={800}
						height={450}
						className='w-full h-48 md:h-full object-cover'
						sizes='(max-width: 768px) 100vw, 320px'
						priority
						placeholder='blur'
						blurDataURL='/placeholder.png'
					/>
				</div>

				<div className='p-3 sm:p-4 md:p-5 flex flex-col flex-grow justify-between min-w-0'>
					<div className='flex flex-col gap-2 sm:gap-3 mb-3 sm:mb-4'>
						<div className='flex items-start justify-between gap-2 sm:gap-3'>
							<h3 className='text-base sm:text-lg font-semibold text-foreground line-clamp-2 flex-grow min-w-0'>
								{dish.name}
							</h3>
							<span className='text-lg sm:text-xl md:text-2xl font-bold text-primary whitespace-nowrap flex-shrink-0'>
								${dish.price}
							</span>
						</div>

						<p className='text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed'>
							{dish.description}
						</p>

						<div className='flex flex-wrap gap-1.5 sm:gap-2'>
							<span
								className={`px-2 py-0.5 sm:py-1 text-xs font-medium rounded-full stable-light ${
									dish.available ? 'bg-success' : 'bg-destructive'
								}`}
							>
								{dish.available ? 'Available' : 'Unavailable'}
							</span>

							{dish.category && (
								<span className='px-2 py-0.5 sm:py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full'>
									{dish.category.name}
								</span>
							)}
						</div>
					</div>

					<div className='grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4 text-xs'>
						<div className='flex flex-col'>
							<span className='text-muted-foreground uppercase tracking-wide'>
								Weight
							</span>
							<span className='text-foreground font-medium mt-0.5 sm:mt-1'>
								{dish.weightGr ? `${dish.weightGr}g` : '—'}
							</span>
						</div>
						<div className='flex flex-col'>
							<span className='text-muted-foreground uppercase tracking-wide'>
								Calories
							</span>
							<span className='text-foreground font-medium mt-0.5 sm:mt-1'>
								{dish.calories ? `${dish.calories} kcal` : '—'}
							</span>
						</div>
					</div>

					<div className='flex flex-col md:flex-row md:items-end gap-2 sm:gap-3 md:gap-4'>
						{dish.ingredients && dish.ingredients.length > 0 && (
							<div className='flex-grow min-w-0'>
								<span className='text-xs text-muted-foreground uppercase tracking-wide mb-1.5 sm:mb-2 block'>
									Ingredients
								</span>
								<div className='flex flex-wrap gap-1'>
									{dish.ingredients.slice(0, 3).map((ingredient, index) => (
										<span
											key={index}
											className='px-2 py-0.5 sm:py-1 text-xs active-item text-foreground rounded-full'
										>
											{ingredient}
										</span>
									))}
									{dish.ingredients.length > 3 && (
										<span className='px-2 py-0.5 sm:py-1 text-xs active-item text-foreground rounded-full'>
											+{dish.ingredients.length - 3} more
										</span>
									)}
								</div>
							</div>
						)}

						<div className='flex-shrink-0 w-full md:w-auto'>
							<Link href={ROUTES.PRIVATE.ADMIN.DISH_ID(dish.id)}>
								<Button
									type='button'
									onClick={() => {}}
									text='View Details'
									className='w-full md:w-auto hover:bg-primary whitespace-nowrap text-sm'
								/>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
