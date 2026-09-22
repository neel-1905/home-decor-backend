import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV } from '@config/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });
  await app.listen(ENV.PORT ?? 3000);
}
bootstrap();
