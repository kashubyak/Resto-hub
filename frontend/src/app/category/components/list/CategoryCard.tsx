'use client'

import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/pages.constant'
import type { ICategoryWithDishes } from '@/types/category.interface'
import Link from 'next/link'
import { memo } from 'react'

interface CategoryCardProps {
	category: ICategoryWithDishes
}

const CategoryCardComponent = ({ category }: CategoryCardProps) => {
	const dishCount = category.dishes?.length || 0

	return (
		<div className='flex flex-col bg-background border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 h-full group'>
			<div className='flex justify-between items-start mb-4'>
				<div className='bg-primary/10 text-primary p-2 rounded-lg'>
					<svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={1.5}
							d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
						/>
					</svg>
				</div>
				<span className='text-[10px] text-muted-foreground bg-muted px-2 py-1 rounded uppercase tracking-wider font-medium'>
					ID: {category.id}
				</span>
			</div>

			<h3
				className='font-bold text-xl mb-2 text-foreground truncate'
				title={category.name}
			>
				{category.name}
			</h3>

			<p className='text-sm text-muted-foreground mb-6'>
				{dishCount} {dishCount === 1 ? 'dish' : 'dishes'}
			</p>

			<div className='mt-auto'>
				<Link
					href={ROUTES.PRIVATE.ADMIN.CATEGORY_ID(category.id)}
					className='w-full block'
				>
					<Button text='View Details' className='w-full' />
				</Link>
			</div>
		</div>
	)
}

export const CategoryCard = memo(CategoryCardComponent)
