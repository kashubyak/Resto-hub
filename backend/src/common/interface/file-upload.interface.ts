export type IOptionalFile = Express.Multer.File | undefined
export type IOptionalFileArray = Express.Multer.File[] | undefined

export interface IMultipleFiles {
	[key: string]: Express.Multer.File[]
}
