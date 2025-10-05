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
		placeholder: 'Select sorting field',
		options: [
			{ value: 'name', label: 'Name' },
			{ value: 'price', label: 'Price' },
			{ value: 'createdAt', label: 'Date Created' },
		],
	},
	{
		type: 'select',
		key: 'order',
		label: 'Sort Order',
		placeholder: 'Select order',
		options: [
			{ value: 'asc', label: 'Ascending' },
			{ value: 'desc', label: 'Descending' },
		],
	},
]
