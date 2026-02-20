import { Restaurant } from '@mui/icons-material'

export const DishDownInfo = ({
	weightGr,
	calories,
	ingredients,
}: {
	weightGr: number | null
	calories: number | null
	ingredients: string[] | null
}) => {
	return (
		<>
			<div className="grid grid-cols-2 gap-4">
				<div className="text-center">
					<div className="text-2xl font-bold text-foreground mb-1">
						{weightGr ? `${weightGr}g` : '—'}
					</div>
					<div className="text-xs text-muted-foreground uppercase tracking-wider">
						Weight
					</div>
				</div>
				<div className="text-center">
					<div className="text-2xl font-bold text-foreground mb-1">
						{calories ? `${calories}` : '—'}
					</div>
					<div className="text-xs text-muted-foreground uppercase tracking-wider">
						Calories
					</div>
				</div>
			</div>

			{ingredients && ingredients.length > 0 && (
				<div className="space-y-3">
					<h3 className="text-lg font-semibold text-foreground flex items-center">
						<Restaurant className="w-4 h-4 mr-2 text-primary" />
						Ingredients
					</h3>
					<div className="flex flex-wrap gap-2">
						{ingredients.map((ingredient, index) => (
							<span
								key={index}
								className="px-3 py-1 active-item text-foreground rounded-full text-sm font-medium hover:bg-muted/80 transition-colors"
							>
								{ingredient}
							</span>
						))}
					</div>
				</div>
			)}
		</>
	)
}
