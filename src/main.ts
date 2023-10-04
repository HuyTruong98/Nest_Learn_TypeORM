import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();
  app.useStaticAssets('.');
  app.setGlobalPrefix('api');
  app.setBaseViewsDir(__dirname + '/templates');
  app.setViewEngine('hbs');

  const config = new DocumentBuilder()
    .setTitle('Blog APIs')
    .setDescription('List APIs for a simple blog by Dev')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger-ui.html', app, document);

  const port = configService.get<number>('PORT');
  await app.listen(port);
}

bootstrap();
