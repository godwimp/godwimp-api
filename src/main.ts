import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new TransformInterceptor());

  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    app.enableCors({
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      methods: ['GET', 'POST'],
      credentials: false,
    });
  }
  // production: CORS disabled entirely — API consumed server-side (Next.js SSR/SSG),
  // never called directly from the browser.

  await app.listen(process.env.PORT ?? 8080);
  console.log(`Server running on port ${process.env.PORT ?? 8080} in ${process.env.NODE_ENV} mode`);
}
bootstrap();
