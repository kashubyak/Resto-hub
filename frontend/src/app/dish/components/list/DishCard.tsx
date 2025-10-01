'use client'

import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/pages.constant'
import type { IDish } from '@/types/dish.interface'
import Image from 'next/image'
import Link from 'next/link'
import { memo } from 'react'

type DishCardProps = { dish: IDish }

const DishCardComponent = ({ dish }: DishCardProps) => (
	<div className='bg-background border border-border rounded-md shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group'>
		<div className='w-full relative'>
			<Image
				src={dish.imageUrl}
				alt={dish.name}
				width={800}
				height={450}
				style={{ width: '100%', height: 'auto', display: 'block' }}
				sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
				priority
				placeholder='blur'
				blurDataURL='/placeholder.png'
			/>
		</div>

		<div className='p-5 flex flex-col flex-grow'>
			<div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4'>
				<div className='flex-grow'>
					<h3 className='text-lg font-semibold text-foreground mb-2 line-clamp-1'>
						{dish.name}
					</h3>
					<p className='text-sm text-muted-foreground line-clamp-2 leading-relaxed'>
						{dish.description}
					</p>
				</div>

				<div className='flex flex-col items-start sm:items-end gap-2 flex-shrink-0'>
					<span className='text-2xl font-bold text-primary'>${dish.price}</span>
					<div className='flex flex-wrap gap-2'>
						<span
							className={`px-2 py-1 text-xs font-medium rounded-full ${
								dish.available ? 'bg-success' : 'bg-destructive'
							}`}
						>
							{dish.available ? 'Available' : 'Unavailable'}
						</span>
						{dish.category && (
							<span className='px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full'>
								{dish.category.name}
							</span>
						)}
					</div>
				</div>
			</div>

			<div className='grid grid-cols-2 gap-3 mb-4 text-xs'>
				<div className='flex flex-col'>
					<span className='text-muted-foreground uppercase tracking-wide'>Weight</span>
					<span className='text-foreground font-medium mt-1'>
						{dish.weightGr ? `${dish.weightGr}g` : '—'}
					</span>
				</div>
				<div className='flex flex-col'>
					<span className='text-muted-foreground uppercase tracking-wide'>Calories</span>
					<span className='text-foreground font-medium mt-1'>
						{dish.calories ? `${dish.calories} kcal` : '—'}
					</span>
				</div>
			</div>

			{dish.ingredients?.length > 0 && (
				<div className='mb-4'>
					<span className='text-xs text-muted-foreground uppercase tracking-wide mb-2 block'>
						Ingredients
					</span>
					<div className='flex flex-wrap gap-1'>
						{dish.ingredients.slice(0, 3).map((ingredient, i) => (
							<span
								key={i}
								className='px-2 py-1 text-xs active-item text-foreground rounded-full'
							>
								{ingredient}
							</span>
						))}
						{dish.ingredients.length > 3 && (
							<span className='px-2 py-1 text-xs active-item text-foreground rounded-full'>
								+{dish.ingredients.length - 3} more
							</span>
						)}
					</div>
				</div>
			)}

			<div className='mt-auto'>
				<Link href={ROUTES.PRIVATE.ADMIN.DISH_ID(dish.id)}>
					<Button className='w-full hover:bg-primary' text='View Details' />
				</Link>
			</div>
		</div>
	</div>
)

export const DishCard = memo(DishCardComponent)
