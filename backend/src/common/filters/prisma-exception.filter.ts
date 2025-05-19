import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    switch (exception.code) {
      case 'P2002':
        statusCode = HttpStatus.CONFLICT;
        message = `Record with this unique constraint already exists. Details: ${
          (exception.meta?.target as string) ?? 'unknown'
        }`;
        break;
      case 'P2003':
        statusCode = HttpStatus.BAD_REQUEST;
        message = `Foreign key constraint failed. Ensure the related record exists. Details: ${
          (exception.meta?.field_name as string) ?? 'unknown'
        }`;
        break;
      case 'P2025':
        statusCode = HttpStatus.NOT_FOUND;
        message = `Record not found.`;
        break;
    }

    response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}
