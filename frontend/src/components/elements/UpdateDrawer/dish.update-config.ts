import type { UpdateSectionConfig } from '@/types/update-field.interface'

export const dishUpdateConfig: UpdateSectionConfig[] = [
	{
		type: 'basic-info',
		component: 'BasicInformationSection',
	},
	{
		type: 'pricing',
		component: 'PricingCategorySection',
	},
] as const
