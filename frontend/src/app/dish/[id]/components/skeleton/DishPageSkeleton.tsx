import { DishActionsSkeleton } from './DishActionsSkeleton'
import { DishDetailsSkeleton } from './DishDetailsSkeleton'
import { DishDownInfoSkeleton } from './DishDownInfoSkeleton'
import { DishImageSkeleton } from './DishImageSkeleton'
import { DishTopInfoSkeleton } from './DishTopInfoSkeleton'

export const DishPageSkeleton = () => {
	return (
		<div className='min-h-screen bg-background p-3 lg:p-4'>
			<div className='flex flex-col lg:grid lg:grid-cols-3'>
				<DishImageSkeleton />
				<div className='lg:col-span-1 flex flex-col'>
					<div className='flex-grow px-4 lg:px-6 lg:pr-0 py-2 space-y-6'>
						<DishTopInfoSkeleton />
						<div className='space-y-6'>
							<DishDownInfoSkeleton />
							<DishDetailsSkeleton />
						</div>
					</div>
					<DishActionsSkeleton />
				</div>
			</div>
		</div>
	)
}
