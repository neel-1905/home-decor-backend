import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV } from '@config/env.config';
import { ResponseInterceptor } from '@common/interceptors';
import { AppValidationPipe } from './common/pipes';
import { HttpExceptionFilter } from './common/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.setGlobalPrefix('api/v1', {
    exclude: ['api/auth/*path'],
  });

  app.useGlobalPipes(new AppValidationPipe());

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));

  await app.listen(ENV.PORT ?? 3000);
}
bootstrap();
