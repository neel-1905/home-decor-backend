import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV } from '@config/env.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.setGlobalPrefix('api/v1', {
    exclude: ['api/auth/*path'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(ENV.PORT ?? 3000);
}
bootstrap();
