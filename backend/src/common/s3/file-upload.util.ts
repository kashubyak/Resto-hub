import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { Options as MulterOptions } from 'multer';
import { size_of_image } from '../constants';

export const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
    return callback(
      new BadRequestException('Only image files are allowed!'),
      false,
    );
  }
  callback(null, true);
};

export const multerOptions: MulterOptions = {
  fileFilter: imageFileFilter,
  limits: {
    fileSize: size_of_image * 1024 * 1024,
  },
};
