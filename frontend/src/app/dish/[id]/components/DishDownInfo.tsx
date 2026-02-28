import { Flame, Scale } from 'lucide-react'

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
			<div className="grid grid-cols-2 gap-3 pt-2">
				<div className="bg-background rounded-xl p-3 border-2 border-border">
					<div className="flex items-center gap-2 mb-1">
						<Scale className="w-4 h-4 text-primary" />
						<span className="text-xs text-muted-foreground font-medium">
							Weight
						</span>
					</div>
					<p className="text-xl font-bold text-foreground">
						{weightGr != null ? `${weightGr}g` : '—'}
					</p>
				</div>
				<div className="bg-background rounded-xl p-3 border-2 border-border">
					<div className="flex items-center gap-2 mb-1">
						<Flame className="w-4 h-4 text-primary" />
						<span className="text-xs text-muted-foreground font-medium">
							Calories
						</span>
					</div>
					<p className="text-xl font-bold text-foreground">
						{calories != null ? `${calories} kcal` : '—'}
					</p>
				</div>
			</div>

			{ingredients && ingredients.length > 0 && (
				<div className="space-y-2 pt-2 border-t border-border">
					<h3 className="text-sm font-semibold text-foreground">Ingredients</h3>
					<div className="flex flex-wrap gap-1.5">
						{ingredients.map((ingredient, index) => (
							<span
								key={index}
								className="px-2.5 py-1 bg-background border border-border rounded-lg text-xs font-medium text-foreground"
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
