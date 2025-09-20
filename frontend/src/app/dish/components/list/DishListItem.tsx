import { Button } from '@/components/ui/Button'
import Image from 'next/image'

interface Dish {
	id: string | number
	name: string
	description: string
	price: number
	imageUrl: string
	category?: {
		name: string
	} | null
}

interface DishListItemProps {
	dish: Dish
}

export const DishListItem: React.FC<DishListItemProps> = ({ dish }) => {
	return (
		<div className='bg-card rounded-xl shadow-sm hover:shadow-md transition p-4'>
			<div className='flex gap-4'>
				<div className='flex-shrink-0'>
					<div className='bg-muted rounded-lg p-2 flex justify-center items-center'>
						<Image
							src={dish.imageUrl}
							alt={dish.name}
							width={120}
							height={120}
							className='max-h-[100px] w-auto object-contain rounded-md'
						/>
					</div>
				</div>

				<div className='flex-grow flex flex-col gap-2'>
					<div className='flex justify-between items-start'>
						<h3 className='text-lg font-semibold'>{dish.name}</h3>
						<p className='text-lg font-medium text-right'>{dish.price}$</p>
					</div>

					<p className='text-sm text-muted-foreground line-clamp-2'>{dish.description}</p>
					<p className='text-xs text-muted-foreground'>
						Category: {dish.category?.name ?? '—'}
					</p>

					<div className='mt-auto pt-2'>
						<Button
							type='submit'
							onClick={() => {}}
							text='More details'
							className='w-fit'
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
