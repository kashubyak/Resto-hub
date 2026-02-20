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
		<div className="space-y-3 pt-4">
			<h3 className="text-lg font-semibold text-foreground">Details</h3>
			<div className="space-y-2 text-sm">
				<div className="flex justify-between">
					<span className="text-muted-foreground">Dish ID</span>
					<span className="font-medium text-foreground">#{id}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-muted-foreground">Category ID</span>
					<span className="font-medium text-foreground">#{categoryId}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-muted-foreground">Created</span>
					<span className="font-medium text-foreground">
						{new Date(createdAt).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-muted-foreground">Last Updated</span>
					<span className="font-medium text-foreground">
						{new Date(updatedAt).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}
					</span>
				</div>
			</div>
		</div>
	)
}
