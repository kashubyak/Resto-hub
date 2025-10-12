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
	{
		type: 'nutritional',
		component: 'NutritionalInfoSection',
	},
] as const
