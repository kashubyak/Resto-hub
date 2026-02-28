'use client'

import { CategoryFilter } from '@/components/elements/Filters/CategoryFilter'
import { RangeFilter } from '@/components/elements/Filters/RangeFilter'
import { SelectFilter } from '@/components/elements/Filters/SelectFilter'
import { useCategories } from '@/hooks/useCategories'
import type {
	FilterConfig,
	FilterValue,
	FilterValues,
} from '@/types/filter.interface'
import { SlidersHorizontal, X } from 'lucide-react'
import { memo, useCallback, useMemo } from 'react'

interface DishFilterPanelProps {
	filters: FilterValues
	filterConfig: FilterConfig[]
	onChange: (key: string, value: FilterValue) => void
	onClearAll: () => void
}

const DishFilterPanelComponent: React.FC<DishFilterPanelProps> = ({
	filters,
	filterConfig,
	onChange,
	onClearAll,
}) => {
	const { allCategories } = useCategories()
	const hasActiveFilters = useMemo(
		() =>
			Object.entries(filters).some(
				([, value]) => value !== undefined && value !== null && value !== '',
			),
		[filters],
	)

	const renderFilter = useCallback(
		(config: FilterConfig) => {
			if (config.key === 'categoryId') {
				return (
					<CategoryFilter
						key={config.key}
						values={filters}
						onChange={onChange}
					/>
				)
			}
			switch (config.type) {
				case 'range':
					return (
						<RangeFilter
							key={config.key}
							config={config}
							values={filters}
							onChange={onChange}
						/>
					)
				case 'select':
					return (
						<SelectFilter
							key={config.key}
							config={config}
							values={filters}
							onChange={onChange}
						/>
					)
				default:
					return null
			}
		},
		[filters, onChange],
	)

	const activeTags = useMemo(() => {
		const tags: { label: string; onRemove: () => void }[] = []
		for (const config of filterConfig) {
			if (config.type === 'range') {
				const rangeConfig = config
				const min = filters[rangeConfig.minKey]
				const max = filters[rangeConfig.maxKey]
				if (
					(min !== undefined && min !== null && min !== '') ||
					(max !== undefined && max !== null && max !== '')
				) {
					const minStr = min != null && min !== '' ? String(min) : '0'
					const maxStr = max != null && max !== '' ? String(max) : '∞'
					tags.push({
						label: `Price: $${minStr} - $${maxStr}`,
						onRemove: () => {
							onChange(rangeConfig.minKey, undefined)
							onChange(rangeConfig.maxKey, undefined)
						},
					})
				}
			}
			if (config.type === 'select') {
				const value = filters[config.key]
				if (value !== undefined && value !== null && value !== '') {
					const selectConfig = config
					const option = selectConfig.options.find(
						(o) => String(o.value) === String(value),
					)
					const label =
						config.key === 'sortBy'
							? 'Sorted'
							: `${config.label}: ${option?.label ?? value}`
					tags.push({
						label,
						onRemove: () => onChange(config.key, undefined),
					})
				}
			}
			if (config.key === 'categoryId') {
				const value = filters.categoryId
				if (value !== undefined && value !== null && value !== '') {
					const category = allCategories.find((c) => c.id === Number(value))
					const categoryName = category?.name ?? `ID: ${value}`
					tags.push({
						label: `Category: ${categoryName}`,
						onRemove: () => onChange('categoryId', undefined),
					})
				}
			}
		}
		return tags
	}, [filterConfig, filters, onChange, allCategories])

	return (
		<div className="bg-card border-2 border-border rounded-2xl overflow-hidden animate-in fade-in-0 slide-in-from-top-2 duration-300">
			<div className="bg-gradient-to-br from-primary/5 to-primary/10 px-5 py-4 border-b-2 border-border flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
						<SlidersHorizontal className="w-4 h-4 text-primary" />
					</div>
					<h3 className="text-lg font-bold text-foreground">Filters</h3>
					{hasActiveFilters && (
						<span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-semibold rounded-full">
							Active
						</span>
					)}
				</div>
				<button
					type="button"
					onClick={onClearAll}
					className="text-sm text-primary hover:underline font-semibold"
				>
					Clear all
				</button>
			</div>

			<div className="p-5">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{filterConfig.map((config) => (
						<div key={config.key}>{renderFilter(config)}</div>
					))}
				</div>

				{activeTags.length > 0 && (
					<div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
						{activeTags.map((tag) => (
							<span
								key={tag.label}
								className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-lg text-xs font-semibold"
							>
								{tag.label}
								<button
									type="button"
									onClick={tag.onRemove}
									className="hover:bg-primary/20 rounded transition-colors p-0.5"
									aria-label={`Remove ${tag.label}`}
								>
									<X className="w-3 h-3" />
								</button>
							</span>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export const DishFilterPanel = memo(DishFilterPanelComponent)
