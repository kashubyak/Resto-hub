'use client'

import { Button } from '@/components/ui/Button'
import type { ICategoryWithDishes } from '@/types/category.interface'
import Link from 'next/link'
import { memo } from 'react'

interface CategoryRowItemProps {
	category: ICategoryWithDishes
}

const CategoryRowItemComponent = ({ category }: CategoryRowItemProps) => {
	const dishCount = category.dishes?.length || 0

	return (
		<div className="group flex items-center justify-between p-4 bg-background border border-border rounded-lg hover:border-primary/50 transition-all duration-200">
			<div className="flex items-center gap-4">
				<div className="bg-primary/10 text-primary p-2 rounded-lg">
					<svg
						className="w-5 h-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1.5}
							d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
						/>
					</svg>
				</div>

				<div className="flex flex-col">
					<h3 className="font-semibold text-foreground text-lg leading-none mb-1.5">
						{category.name}
					</h3>
					<div className="flex items-center gap-3 text-sm text-muted-foreground">
						<span>ID: {category.id}</span>
						<span className="w-1 h-1 rounded-full bg-border" />
						<span>
							{dishCount} {dishCount === 1 ? 'dish' : 'dishes'}
						</span>
					</div>
				</div>
			</div>

			<div className="flex items-center">
				<Link href={`/category/${category.id}`}>
					<Button text="View Details" className="whitespace-nowrap" />
				</Link>
			</div>
		</div>
	)
}

export const CategoryRowItem = memo(CategoryRowItemComponent)
