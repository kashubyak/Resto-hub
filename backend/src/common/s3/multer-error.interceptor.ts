import {
	BadRequestException,
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common'
import { MulterError } from 'multer'
import { Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { size_of_image } from '../constants'

@Injectable()
export class MulterErrorInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		return next.handle().pipe(
			catchError((err: unknown) => {
				if (err instanceof MulterError) {
					const messageMap: Record<string, string> = {
						LIMIT_FILE_SIZE: `File is too large. Max size is ${size_of_image}MB.`,
						LIMIT_FILE_COUNT: 'Too many files uploaded.',
						LIMIT_UNEXPECTED_FILE: 'Unexpected file field.',
					}
					throw new BadRequestException(messageMap[err.code] || err.message)
				}
				throw err
			}),
		)
	}
}
