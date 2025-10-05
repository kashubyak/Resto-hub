// frontend/src/components/elements/Filters/dish.filters.ts
import type { FilterConfig } from '@/types/filter.interface'

export const dishFilters: FilterConfig[] = [
	{
		type: 'range',
		key: 'price',
		label: 'Price Range',
		minKey: 'minPrice',
		maxKey: 'maxPrice',
		min: 0,
		step: 0.01,
		suffix: '$',
	},
	{
		type: 'boolean',
		key: 'available',
		label: 'Available Only',
	},
	{
		type: 'select',
		key: 'sortBy',
		label: 'Sort By',
		placeholder: 'Select sorting',
		options: [
			{ value: 'name-asc', label: 'Name (A → Z)' },
			{ value: 'name-desc', label: 'Name (Z → A)' },
			{ value: 'price-asc', label: 'Price (Low → High)' },
			{ value: 'price-desc', label: 'Price (High → Low)' },
			{ value: 'createdAt-asc', label: 'Date Created (Oldest First)' },
			{ value: 'createdAt-desc', label: 'Date Created (Newest First)' },
		],
	},
]
