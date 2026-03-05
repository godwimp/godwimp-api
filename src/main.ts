import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new TransformInterceptor());

  const isDev = process.env.NODE_ENV !== 'production';

  const allowedOrigins = isDev
    ? ['http://localhost:3000', 'http://localhost:3001']
    : (process.env.ALLOWED_ORIGINS ?? 'https://godwimp.me,https://www.godwimp.me').split(',').map((o) => o.trim());

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'DELETE'],
    credentials: false,
  });

  await app.listen(process.env.PORT ?? 8080);
  console.log(`Server running on port ${process.env.PORT ?? 8080} in ${process.env.NODE_ENV} mode`);
}
bootstrap();
