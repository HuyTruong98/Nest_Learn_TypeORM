import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../credentials/serviceAccountKey.json';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.useStaticAssets('.');
  app.setGlobalPrefix('api');
  app.setBaseViewsDir(__dirname + '/templates');
  app.setViewEngine('hbs');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });

  const config = new DocumentBuilder()
    .setTitle('Blog APIs')
    .setDescription('List APIs for a simple blog by Dev')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger-ui.html', app, document);

  await app.listen(process.env.PORT);
}

bootstrap();
