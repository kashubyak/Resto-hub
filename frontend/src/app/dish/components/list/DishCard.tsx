'use client'

import { ROUTES } from '@/constants/pages.constant'
import type { IDish } from '@/types/dish.interface'
import { Eye, Flame, Scale } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { memo } from 'react'

type DishCardProps = { dish: IDish }

const DishCardComponent = ({ dish }: DishCardProps) => (
	<div className="group bg-card border-2 border-border rounded-2xl overflow-hidden hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
		<div className="relative aspect-square bg-background overflow-hidden">
			<Image
				src={dish.imageUrl}
				alt={dish.name}
				fill
				className="object-cover group-hover:scale-110 transition-transform duration-500"
				sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
				placeholder="blur"
				blurDataURL="/placeholder.png"
			/>
			<div className="absolute top-3 right-3 z-10">
				<span
					className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${
						dish.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
					}`}
				>
					{dish.available ? 'Available' : 'Unavailable'}
				</span>
			</div>
		</div>

		<div className="p-4 space-y-3">
			<div className="flex items-start justify-between gap-2">
				<div className="flex-1 min-w-0">
					<h3 className="text-lg font-semibold text-foreground truncate">
						{dish.name}
					</h3>
					<p className="text-sm text-muted-foreground truncate">
						{dish.description}
					</p>
				</div>
				<span className="text-xl font-bold text-primary flex-shrink-0">
					${dish.price}
				</span>
			</div>

			<div className="flex items-center gap-4 text-xs text-muted-foreground">
				<div className="flex items-center gap-1">
					<Scale className="w-3.5 h-3.5" />
					<span>{dish.weightGr != null ? `${dish.weightGr}g` : '—'}</span>
				</div>
				<div className="flex items-center gap-1">
					<Flame className="w-3.5 h-3.5" />
					<span>
						{dish.calories != null ? `${dish.calories} kcal` : '—'}
					</span>
				</div>
			</div>

			{dish.ingredients?.length > 0 && (
				<div className="space-y-1.5">
					<span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
						Ingredients
					</span>
					<div className="flex flex-wrap gap-1.5">
						{dish.ingredients.map((ingredient, idx) => (
							<span
								key={idx}
								className="px-2 py-0.5 bg-background border border-border rounded-md text-xs text-foreground"
							>
								{ingredient}
							</span>
						))}
					</div>
				</div>
			)}

			<Link href={ROUTES.PRIVATE.ADMIN.DISH_ID(dish.id)}>
				<button
					type="button"
					className="w-full h-10 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 group/btn"
				>
					<Eye className="w-4 h-4" />
					<span>View Details</span>
				</button>
			</Link>
		</div>
	</div>
)

export const DishCard = memo(DishCardComponent)
