export type UpdateFieldType =
	| 'text'
	| 'textarea'
	| 'number'
	| 'switch'
	| 'select'
	| 'file'
	| 'tags'

export interface BaseUpdateFieldConfig {
	key: string
	label: string
	type: UpdateFieldType
	helperText?: string
	disabled?: boolean
	required?: boolean
}

export interface TextFieldConfig extends BaseUpdateFieldConfig {
	type: 'text'
	maxLength?: number
}
export interface TextAreaFieldConfig extends BaseUpdateFieldConfig {
	type: 'textarea'
	rows?: number
	maxLength?: number
}
export interface NumberFieldConfig extends BaseUpdateFieldConfig {
	type: 'number'
	min?: number
	max?: number
	step?: number
	suffix?: string
}

export interface SwitchFieldConfig extends BaseUpdateFieldConfig {
	type: 'switch'
}

export interface SelectFieldConfig extends BaseUpdateFieldConfig {
	type: 'select'
	options: Array<{ label: string; value: string | number }>
	fetchOptions?: () => Promise<Array<{ label: string; value: string | number }>>
}

export interface FileFieldConfig extends BaseUpdateFieldConfig {
	type: 'file'
	accept?: string
	preview?: boolean
	currentFileUrl: string
}

export interface TagsFieldConfig extends BaseUpdateFieldConfig {
	type: 'tags'
	maxTags?: number
}
export type UpdateFieldConfig =
	| TextFieldConfig
	| TextAreaFieldConfig
	| NumberFieldConfig
	| SwitchFieldConfig
	| SelectFieldConfig
	| FileFieldConfig
	| TagsFieldConfig

export type UpdateFieldValue =
	| string
	| number
	| boolean
	| File
	| string[]
	| null
	| undefined
export type UpdateFormValues = Record<string, UpdateFieldValue>
