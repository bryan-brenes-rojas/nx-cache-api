import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, raw } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    rawBody: true,
  });
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });
  app.use(raw({ type: 'application/octet-stream', limit: '50mb' }));
  app.use(json({ limit: '50mb' }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
