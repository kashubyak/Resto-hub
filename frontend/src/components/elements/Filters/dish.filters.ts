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
		type: 'select',
		key: 'available',
		label: 'Status',
		placeholder: 'All statuses',
		options: [
			{ value: 'true', label: 'Active (Available)' },
			{ value: 'false', label: 'Inactive (Hidden)' },
		],
	},

	{
		type: 'select',
		key: 'sortBy',
		label: 'Sort By',
		placeholder: 'Default sorting',
		options: [
			{ value: 'createdAt-desc', label: 'Created: Newest first' },
			{ value: 'createdAt-asc', label: 'Created: Oldest first' },
			{ value: 'name-asc', label: 'Name (A-Z)' },
			{ value: 'name-desc', label: 'Name (Z-A)' },
			{ value: 'price-asc', label: 'Price (Low-High)' },
			{ value: 'price-desc', label: 'Price (High-Low)' },
		],
	},
] as const
