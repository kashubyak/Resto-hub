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
		<div className='bg-background border border-border rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group'>
			<div className='flex flex-col sm:flex-row'>
				<div className='relative w-full sm:w-[22rem] aspect-video bg-muted flex-shrink-0'>
					<Image src={dish.imageUrl} alt={dish.name} fill className='object-contain' />
				</div>

				<div className='p-5 flex flex-col flex-grow justify-between'>
					<div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4'>
						<div className='flex-grow'>
							<h3 className='text-lg font-semibold text-foreground mb-2 line-clamp-1'>
								{dish.name}
							</h3>
							<p className='text-sm text-muted-foreground line-clamp-2 leading-relaxed'>
								{dish.description}
							</p>
						</div>

						<div className='flex flex-col items-start sm:items-end gap-2 flex-shrink-0'>
							<span className='text-2xl font-bold text-primary'>${dish.price}</span>

							<div className='flex flex-wrap gap-2'>
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
							</div>
						</div>
					</div>

					<div className='grid grid-cols-2 gap-3 mb-4 text-xs'>
						<div className='flex flex-col'>
							<span className='text-muted-foreground uppercase tracking-wide'>
								Weight
							</span>
							<span className='text-foreground font-medium mt-1'>
								{dish.weightGr ? `${dish.weightGr}g` : '—'}
							</span>
						</div>
						<div className='flex flex-col'>
							<span className='text-muted-foreground uppercase tracking-wide'>
								Calories
							</span>
							<span className='text-foreground font-medium mt-1'>
								{dish.calories ? `${dish.calories} kcal` : '—'}
							</span>
						</div>
					</div>

					<div className='flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4'>
						{dish.ingredients && dish.ingredients.length > 0 && (
							<div className='flex-grow'>
								<span className='text-xs text-muted-foreground uppercase tracking-wide mb-2 block'>
									Ingredients
								</span>
								<div className='flex flex-wrap gap-1'>
									{dish.ingredients.slice(0, 3).map((ingredient, index) => (
										<span
											key={index}
											className='px-2 py-1 text-xs active-item text-foreground rounded-full'
										>
											{ingredient}
										</span>
									))}
									{dish.ingredients.length > 3 && (
										<span className='px-2 py-1 text-xs active-item text-foreground rounded-full'>
											+{dish.ingredients.length - 3} more
										</span>
									)}
								</div>
							</div>
						)}

						<div className='flex-shrink-0 sm:ml-4'>
							<Link href={ROUTES.PRIVATE.ADMIN.DISH_ID(dish.id)}>
								<Button
									type='button'
									onClick={() => {}}
									text='View Details'
									className='w-full hover:bg-primary'
								/>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
