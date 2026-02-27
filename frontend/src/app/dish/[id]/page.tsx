'use client'

import { NotFound } from '@/components/ui/NotFound'
import { ROUTES } from '@/constants/pages.constant'
import { useDishes } from '@/hooks/useDishes'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { use } from 'react'
import { DishActions } from './components/DishActions'
import { DishDetails } from './components/DishDetails'
import { DishDownInfo } from './components/DishDownInfo'
import { DishImage } from './components/DishImage'
import { DishTopInfo } from './components/DishTopInfo'
import { DishPageSkeleton } from './components/skeleton/DishPageSkeleton'

export default function DishPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = use(params)
	const { dishQuery } = useDishes(Number(id))

	if (dishQuery.isLoading) return <DishPageSkeleton />
	if (dishQuery.isError || !dishQuery.data)
		return (
			<NotFound
				icon="🍽️"
				title="Dish Not Found"
				message="Sorry, we could not load this dish."
			/>
		)

	const dish = dishQuery.data

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
				{/* Compact Header */}
				<div className="flex items-center gap-3 mb-4">
					<Link
						href={ROUTES.PRIVATE.ADMIN.DISH}
						className="w-10 h-10 flex items-center justify-center rounded-xl bg-card border-2 border-border hover:border-primary hover:text-primary transition-all duration-300"
						aria-label="Back to dish list"
					>
						<ArrowLeft className="w-5 h-5" />
					</Link>
					<h1 className="text-xl font-semibold text-foreground">Dish Details</h1>
				</div>

				{/* Main Content */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
					<DishImage imageUrl={dish.imageUrl} name={dish.name} />

					<div className="lg:col-span-5 xl:col-span-4 space-y-4 pb-4 lg:pb-8">
						{/* Card 1: Main Info */}
						<div className="bg-card border-2 border-border rounded-2xl p-5 space-y-4">
							<DishTopInfo
								name={dish.name}
								description={dish.description}
								price={dish.price}
								available={dish.available}
								category={dish.category}
							/>
							<DishDownInfo
								weightGr={dish.weightGr}
								calories={dish.calories}
								ingredients={dish.ingredients}
							/>
						</div>

						{/* Card 2: Information */}
						<div className="bg-card border-2 border-border rounded-2xl p-5 space-y-3">
							<DishDetails
								id={dish.id}
								categoryId={dish.categoryId}
								createdAt={dish.createdAt}
								updatedAt={dish.updatedAt}
							/>
						</div>

						{/* Card 3: Actions */}
						<div className="bg-card border-2 border-border rounded-2xl p-5 space-y-3">
							<DishActions id={dish.id} />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
