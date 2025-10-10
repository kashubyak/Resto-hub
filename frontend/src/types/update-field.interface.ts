export type UpdateSectionType =
	| 'basic-info'
	| 'pricing'
	| 'ingredients'
	| 'nutritional'
	| 'image'

export interface BaseUpdateSectionConfig {
	type: UpdateSectionType
	component: string
}

export interface BasicInfoSectionConfig extends BaseUpdateSectionConfig {
	type: 'basic-info'
	component: 'BasicInformationSection'
}

export interface PricingSectionConfig extends BaseUpdateSectionConfig {
	type: 'pricing'
	component: 'PricingCategorySection'
}

export interface IngredientsSectionConfig extends BaseUpdateSectionConfig {
	type: 'ingredients'
	component: 'IngredientsSection'
}

export interface NutritionalSectionConfig extends BaseUpdateSectionConfig {
	type: 'nutritional'
	component: 'NutritionalInfoSection'
}

export interface ImageSectionConfig extends BaseUpdateSectionConfig {
	type: 'image'
	component: 'ImageUploadSection'
}

export type UpdateSectionConfig =
	| BasicInfoSectionConfig
	| PricingSectionConfig
	| IngredientsSectionConfig
	| NutritionalSectionConfig
	| ImageSectionConfig

export type UpdateFieldValue =
	| string
	| number
	| boolean
	| File
	| string[]
	| null
	| undefined

export type UpdateFormValues = Record<string, UpdateFieldValue>
