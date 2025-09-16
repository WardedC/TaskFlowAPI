import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar validaciÃ³n global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configurar documentaciÃ³n con Scalar
  const config = new DocumentBuilder()
    .setTitle('TaskFlow API')
    .setVersion('1.0')

    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'bearer',
    )
    .addTag('users', 'GestiÃ³n de usuarios')
    .addTag('workspaces', 'GestiÃ³n de espacios de trabajo')
    .addTag('boards', 'GestiÃ³n de tableros')
    .addTag('lists', 'GestiÃ³n de listas')
    .addTag('cards', 'GestiÃ³n de tarjetas')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Configurar Scalar API Reference segÃºn documentaciÃ³n oficial
  app.use(
    '/api',
    apiReference({
      theme: 'purple',
      content: document,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `API corriendo en: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `Documentación API: http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}
bootstrap();
