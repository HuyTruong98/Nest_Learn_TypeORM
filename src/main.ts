import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();
  app.use(express.static('.'));
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Blog APIs')
    .setDescription('List APIs for simple by Dev')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger-ui.html', app, document);

  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
