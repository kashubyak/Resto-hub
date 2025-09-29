import type { IDish } from '@/types/dish.interface'

export const DishTopInfo = ({ dish }: { dish: IDish }) => {
	return (
		<div className='space-y-3'>
			<h1 className='text-3xl lg:text-4xl font-bold text-foreground leading-tight'>
				{dish.name}
			</h1>
			<div className='text-3xl lg:text-3xl font-bold text-primary'>${dish.price}</div>
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
	)
}
