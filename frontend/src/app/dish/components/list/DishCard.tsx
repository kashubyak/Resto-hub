import { Button } from '@/components/ui/Button'
import type { IDish } from '@/types/dish.interface'
import Image from 'next/image'

interface IDishCardProps {
	dish: IDish
}

export const DishCard: React.FC<IDishCardProps> = ({ dish }) => {
	return (
		<div className='bg-card rounded-xl shadow-sm hover:shadow-md transition flex flex-col overflow-hidden'>
			<div className='bg-muted flex justify-center items-center p-2'>
				<Image
					src={dish.imageUrl}
					alt={dish.name}
					width={240}
					height={240}
					className='max-h-[200px] w-auto object-contain rounded-lg'
				/>
			</div>
			<div className='p-4 flex flex-col gap-2 flex-grow'>
				<h3 className='text-lg font-semibold'>{dish.name}</h3>
				<p className='text-sm text-muted-foreground line-clamp-2'>{dish.description}</p>
				<p className='text-base font-medium mt-1'>{dish.price}$</p>
				<p className='text-xs text-muted-foreground'>
					Category: {dish.category?.name ?? '—'}
				</p>

				<div className='mt-auto pt-3'>
					<Button
						type='submit'
						onClick={() => {}}
						text='More details'
						className='w-full'
					/>
				</div>
			</div>
		</div>
	)
}
