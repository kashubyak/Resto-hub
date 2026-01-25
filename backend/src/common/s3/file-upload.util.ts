import { BadRequestException } from '@nestjs/common'
import { type Request } from 'express'
import { type Options as MulterOptions } from 'multer'
import { size_of_image } from '../constants'

export const imageFileFilter = (
	_req: Request,
	file: Express.Multer.File,
	callback: (error: Error | null, acceptFile: boolean) => void,
) => {
	if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
		return callback(
			new BadRequestException('Only image files are allowed!'),
			false,
		)
	}
	callback(null, true)
}

export const multerOptions = {
	fileFilter: imageFileFilter,
	limits: {
		fileSize: size_of_image * 1024 * 1024,
	},
} as MulterOptions
