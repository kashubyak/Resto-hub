import type { ICategory } from '@/types/category.interface'

export const DishTopInfo = ({
	name,
	description,
	price,
	available,
	category,
}: {
	name: string
	description: string
	price: number
	available: boolean
	category: ICategory | null | undefined
}) => {
	return (
		<div className="space-y-3">
			<h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
				{name}
			</h1>
			<div className="text-3xl lg:text-3xl font-bold text-primary">
				${price}
			</div>
			<div className="flex items-center gap-3 flex-wrap">
				<span
					className={`px-2 py-1 text-xs font-medium rounded-full stable-light ${
						available ? 'bg-success' : 'bg-destructive'
					}`}
				>
					{available ? 'Available' : 'Unavailable'}
				</span>
				{category && (
					<span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
						{category.name}
					</span>
				)}
			</div>
			<p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
				{description}
			</p>
		</div>
	)
}
