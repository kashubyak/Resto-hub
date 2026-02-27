import { CalendarDays, Clock, Hash, Tag } from 'lucide-react'

const dateFormat = (date: string) =>
	new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})

export const DishDetails = ({
	id,
	categoryId,
	createdAt,
	updatedAt,
}: {
	id: number
	categoryId: number | null
	createdAt: string
	updatedAt: string
}) => {
	return (
		<>
			<h3 className="text-sm font-semibold text-foreground">Information</h3>
			<div className="space-y-2.5">
				<div className="flex items-center justify-between text-sm">
					<div className="flex items-center gap-2 text-muted-foreground">
						<Hash className="w-3.5 h-3.5" />
						<span>Dish ID</span>
					</div>
					<span className="font-semibold text-foreground">#{id}</span>
				</div>
				<div className="flex items-center justify-between text-sm">
					<div className="flex items-center gap-2 text-muted-foreground">
						<Tag className="w-3.5 h-3.5" />
						<span>Category ID</span>
					</div>
					<span className="font-semibold text-foreground">
						{categoryId != null ? `#${categoryId}` : '—'}
					</span>
				</div>
				<div className="flex items-center justify-between text-sm">
					<div className="flex items-center gap-2 text-muted-foreground">
						<CalendarDays className="w-3.5 h-3.5" />
						<span>Created</span>
					</div>
					<span className="font-semibold text-foreground">
						{dateFormat(createdAt)}
					</span>
				</div>
				<div className="flex items-center justify-between text-sm">
					<div className="flex items-center gap-2 text-muted-foreground">
						<Clock className="w-3.5 h-3.5" />
						<span>Last Updated</span>
					</div>
					<span className="font-semibold text-foreground">
						{dateFormat(updatedAt)}
					</span>
				</div>
			</div>
		</>
	)
}
