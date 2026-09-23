import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'validationErrors' in exceptionResponse
    ) {
      const validationResponse = exceptionResponse as {
        message: string;
        validationErrors: {
          field: string;
          rule: string;
          message: string;
        }[];
      };

      response.status(status).json({
        type: 'https://api.yourdomain.com/errors/validation-error',
        title: 'Unprocessable Entity',
        status,
        detail: validationResponse.message,
        instance: request.url,
        errors: validationResponse.validationErrors,
        timestamp: new Date().toISOString(),
      });

      return;
    }

    const detail =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : exceptionResponse &&
            typeof exceptionResponse === 'object' &&
            'message' in exceptionResponse &&
            typeof exceptionResponse.message === 'string'
          ? exceptionResponse.message
          : 'An unexpected error occurred.';

    response.status(status).json({
      type: `https://api.yourdomain.com/errors/${getErrorType(status)}`,
      title: getErrorTitle(status),
      status,
      detail,
      instance: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}

function getErrorType(status: number): string {
  return (
    {
      400: 'bad-request',
      401: 'unauthorized',
      403: 'forbidden',
      404: 'not-found',
      409: 'conflict',
      422: 'validation-error',
      500: 'internal-server-error',
    }[status] ?? 'error'
  );
}

function getErrorTitle(status: number): string {
  return (
    {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Resource Not Found',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      500: 'Internal Server Error',
    }[status] ?? 'Internal Server Error'
  );
}
