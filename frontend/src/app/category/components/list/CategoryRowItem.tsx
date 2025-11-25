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
		<div className='group flex items-center justify-between p-4 bg-background border border-border rounded-lg hover:border-primary/50 transition-all duration-200'>
			<div className='flex items-center gap-4'>
				<div className='flex flex-col'>
					<h3 className='font-semibold text-foreground text-lg'>{category.name}</h3>
					<div className='flex items-center gap-3 text-sm text-muted-foreground'>
						<span>ID: {category.id}</span>
						<span className='w-1 h-1 rounded-full bg-border' />
						<span>
							{dishCount} {dishCount === 1 ? 'dish' : 'dishes'}
						</span>
					</div>
				</div>
			</div>

			<div className='flex items-center'>
				<Link href={`/category/${category.id}`}>
					<Button text='Edit' />
				</Link>
			</div>
		</div>
	)
}

export const CategoryRowItem = memo(CategoryRowItemComponent)
