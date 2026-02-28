'use client'

import type { ICategory } from '@/types/category.interface'
import { CheckCircle2, ChevronDown, ChevronUp, XCircle } from 'lucide-react'
import { useState } from 'react'

const DESCRIPTION_LIMIT = 150

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
	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
	const shouldShowToggle = description.length > DESCRIPTION_LIMIT
	const displayedDescription =
		isDescriptionExpanded || !shouldShowToggle
			? description
			: `${description.slice(0, DESCRIPTION_LIMIT)}...`

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<div className="flex items-start justify-between gap-3">
					<h2 className="text-2xl font-bold text-foreground flex-1">{name}</h2>
					<span
						className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 flex-shrink-0 ${
							available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
						}`}
					>
						{available ? (
							<>
								<CheckCircle2 className="w-3.5 h-3.5" />
								Available
							</>
						) : (
							<>
								<XCircle className="w-3.5 h-3.5" />
								Unavailable
							</>
						)}
					</span>
				</div>
				<span className="text-3xl font-bold text-primary block">${price}</span>
				{category && (
					<span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
						{category.name}
					</span>
				)}
			</div>

			<div className="space-y-2 pt-2 border-t border-border">
				<p className="text-sm text-muted-foreground leading-relaxed">
					{displayedDescription}
				</p>
				{shouldShowToggle && (
					<button
						type="button"
						onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
						className="flex items-center gap-1 text-sm font-medium text-primary hover:underline transition-all"
					>
						{isDescriptionExpanded ? (
							<>
								Show less
								<ChevronUp className="w-4 h-4" />
							</>
						) : (
							<>
								Show more
								<ChevronDown className="w-4 h-4" />
							</>
						)}
					</button>
				)}
			</div>
		</div>
	)
}
