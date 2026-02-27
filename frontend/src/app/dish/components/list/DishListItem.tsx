'use client'

import { ROUTES } from '@/constants/pages.constant'
import type { IDish } from '@/types/dish.interface'
import { Eye, Flame, Scale } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { memo } from 'react'

type DishListItemProps = { dish: IDish }

const DishListItemComponent = ({ dish }: DishListItemProps) => (
	<div className="group bg-card border-2 border-border rounded-2xl overflow-hidden hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
		<div className="flex flex-col sm:flex-row">
			<div className="relative w-full sm:w-64 h-48 sm:h-auto sm:aspect-square bg-background overflow-hidden flex-shrink-0">
				<Image
					src={dish.imageUrl}
					alt={dish.name}
					fill
					className="object-cover group-hover:scale-110 transition-transform duration-500"
					sizes="(max-width: 640px) 100vw, 256px"
					placeholder="blur"
					blurDataURL="/placeholder.png"
				/>
			</div>

			<div className="flex-1 p-5 sm:p-6 flex flex-col">
				<div className="flex items-start justify-between gap-4 mb-3">
					<div className="flex-1 min-w-0">
						<h3 className="text-xl font-semibold text-foreground mb-1">
							{dish.name}
						</h3>
						<p className="text-sm text-muted-foreground line-clamp-2">
							{dish.description}
						</p>
					</div>
					<div className="flex items-center gap-3 flex-shrink-0">
						<span className="text-2xl font-bold text-primary">
							${dish.price}
						</span>
						<span
							className={`px-3 py-1 rounded-full text-xs font-semibold ${
								dish.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
							}`}
						>
							{dish.available ? 'Available' : 'Unavailable'}
						</span>
					</div>
				</div>

				<div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
					<div className="flex items-center gap-1.5">
						<div className="w-7 h-7 rounded-lg bg-background flex items-center justify-center">
							<Scale className="w-4 h-4" />
						</div>
						<div>
							<span className="text-xs uppercase tracking-wide block">
								Weight
							</span>
							<span className="font-medium text-foreground">
								{dish.weightGr != null ? `${dish.weightGr}g` : '—'}
							</span>
						</div>
					</div>
					<div className="flex items-center gap-1.5">
						<div className="w-7 h-7 rounded-lg bg-background flex items-center justify-center">
							<Flame className="w-4 h-4" />
						</div>
						<div>
							<span className="text-xs uppercase tracking-wide block">
								Calories
							</span>
							<span className="font-medium text-foreground">
								{dish.calories != null ? `${dish.calories} kcal` : '—'}
							</span>
						</div>
					</div>
				</div>

				{dish.ingredients?.length > 0 && (
					<div className="space-y-2 mb-4">
						<span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
							Ingredients
						</span>
						<div className="flex flex-wrap gap-2">
							{dish.ingredients.map((ingredient, idx) => (
								<span
									key={idx}
									className="px-2.5 py-1 bg-background border border-border rounded-md text-xs text-foreground"
								>
									{ingredient}
								</span>
							))}
						</div>
					</div>
				)}

				<div className="flex gap-2 mt-auto">
					<Link href={ROUTES.PRIVATE.ADMIN.DISH_ID(dish.id)} className="flex-1">
						<button
							type="button"
							className="w-full h-10 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
						>
							<Eye className="w-4 h-4" />
							<span>View Details</span>
						</button>
					</Link>
				</div>
			</div>
		</div>
	</div>
)

export const DishListItem = memo(DishListItemComponent)
