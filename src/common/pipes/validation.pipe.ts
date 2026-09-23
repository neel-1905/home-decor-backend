import {
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

export class AppValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,

      exceptionFactory: (errors: ValidationError[]) => {
        const validationErrors = errors.flatMap((error) =>
          Object.entries(error.constraints ?? {}).map(([rule, message]) => ({
            field: error.property,
            rule,
            message,
          })),
        );

        return new UnprocessableEntityException({
          message: 'The given request contains invalid validation parameters.',
          validationErrors,
        });
      },
    });
  }
}
