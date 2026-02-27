'use client'

import { ROUTES } from '@/constants/pages.constant'
import type { ICategoryWithDishes } from '@/types/category.interface'
import { Edit, Folder, MoreVertical, Tag, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { memo, useCallback, useState } from 'react'

const GRADIENTS = [
	'from-green-500/10 to-emerald-500/10',
	'from-orange-500/10 to-red-500/10',
	'from-pink-500/10 to-rose-500/10',
	'from-blue-500/10 to-cyan-500/10',
	'from-lime-500/10 to-green-500/10',
	'from-amber-500/10 to-yellow-500/10',
	'from-purple-500/10 to-pink-500/10',
	'from-teal-500/10 to-blue-500/10',
] as const

function getRandomGradient() {
	return GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)]
}

function getCategoryEmoji(name: string) {
	const lower = name.toLowerCase()
	if (lower.includes('appetizer') || lower.includes('starter')) return '🥗'
	if (lower.includes('main') || lower.includes('entree')) return '🍽️'
	if (lower.includes('dessert') || lower.includes('sweet')) return '🍰'
	if (lower.includes('beverage') || lower.includes('drink')) return '🥤'
	if (lower.includes('salad')) return '🥙'
	if (lower.includes('soup')) return '🍲'
	if (lower.includes('pizza')) return '🍕'
	if (lower.includes('burger')) return '🍔'
	if (lower.includes('sushi')) return '🍣'
	if (lower.includes('pasta')) return '🍝'
	if (lower.includes('breakfast')) return '🍳'
	if (lower.includes('seafood') || lower.includes('fish')) return '🐟'
	return '🍴'
}

interface CategoryCardProps {
	category: ICategoryWithDishes
	refetchCategories: () => void
	onEditClick?: (category: ICategoryWithDishes) => void
	onDeleteClick?: (category: ICategoryWithDishes) => void
}

const CategoryCardComponent = ({
	category,
	refetchCategories,
	onEditClick,
	onDeleteClick,
}: CategoryCardProps) => {
	const [menuOpen, setMenuOpen] = useState(false)

	const dishCount = category.dishes?.length ?? 0
	const gradient = getRandomGradient()
	const emoji = category.icon || getCategoryEmoji(category.name)

	const handleEdit = useCallback(() => {
		setMenuOpen(false)
		if (onEditClick) onEditClick(category)
	}, [category, onEditClick])

	const handleDelete = useCallback(() => {
		setMenuOpen(false)
		if (onDeleteClick) onDeleteClick(category)
	}, [category, onDeleteClick])

	return (
		<div className="group bg-card border-2 border-border rounded-2xl overflow-hidden hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
			<div
				className={`relative h-32 bg-gradient-to-br ${gradient} flex items-center justify-center border-b-2 border-border`}
			>
				<span className="text-6xl group-hover:scale-110 transition-transform duration-300">
					{emoji}
				</span>

				<div className="absolute top-3 right-3">
					<div className="relative">
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation()
								setMenuOpen((o) => !o)
							}}
							className="w-8 h-8 rounded-lg bg-card/90 backdrop-blur-sm hover:bg-card border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
							aria-label="Category actions"
						>
							<MoreVertical className="w-4 h-4 text-muted-foreground" />
						</button>

						{menuOpen && (
							<>
								<div
									className="fixed inset-0 z-40"
									onClick={() => setMenuOpen(false)}
									aria-hidden
								/>
								<div
									className="absolute top-full right-0 mt-2 w-48 bg-popover border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
									onClick={(e) => e.stopPropagation()}
								>
									<div className="py-1">
										<button
											type="button"
											onClick={handleEdit}
											className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors text-left"
										>
											<Edit className="w-4 h-4 text-muted-foreground" />
											<span className="text-sm text-foreground">Edit Category</span>
										</button>
										<button
											type="button"
											onClick={handleDelete}
											className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors text-left text-red-600 dark:text-red-400"
										>
											<Trash2 className="w-4 h-4" />
											<span className="text-sm font-medium">Delete Category</span>
										</button>
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			</div>

			<div className="p-4 space-y-3">
				<div>
					<h3 className="text-lg font-semibold text-foreground truncate">
						{category.name}
					</h3>
					<p className="text-sm text-muted-foreground">
						Created{' '}
						{new Date(category.createdAt).toLocaleDateString('en-US', {
							month: 'short',
							day: 'numeric',
							year: 'numeric',
						})}
					</p>
				</div>

				<div className="flex items-center gap-2 py-2 px-3 bg-background rounded-lg border border-border">
					<Tag className="w-4 h-4 text-primary" />
					<span className="text-sm font-medium text-foreground">
						{dishCount} {dishCount === 1 ? 'dish' : 'dishes'}
					</span>
				</div>

				<Link
					href={ROUTES.PRIVATE.ADMIN.DISH}
					className="w-full h-10 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
				>
					<Folder className="w-4 h-4" />
					<span>View Dishes</span>
				</Link>
			</div>
		</div>
	)
}

export const CategoryCard = memo(CategoryCardComponent)
