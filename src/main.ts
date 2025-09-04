import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  // Configurar documentación con Scalar
  const config = new DocumentBuilder()
    .setTitle('TaskFlow API')
    .setDescription('API para gestión de tareas, tableros y espacios de trabajo')
    .setVersion('1.0')
    .addTag('users', 'Gestión de usuarios')
    .addTag('workspaces', 'Gestión de espacios de trabajo')
    .addTag('boards', 'Gestión de tableros')
    .addTag('lists', 'Gestión de listas')
    .addTag('cards', 'Gestión de tarjetas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Configurar Scalar API Reference según documentación oficial
  app.use(
    '/api',
    apiReference({
      theme: 'purple',
      content: document,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Aplicación corriendo en: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`📚 Documentación API: http://localhost:${process.env.PORT ?? 3000}/api`);
}
bootstrap();
