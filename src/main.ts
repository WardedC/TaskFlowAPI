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

  // Configurar documentación con Scalar
  const config = new DocumentBuilder()
    .setTitle('TaskFlow API')
    .setDescription(`
      API REST para gestión de tareas tipo Kanban con arquitectura jerárquica:
      **User → Workspace → Board → List → Task**
      
      ## 🔒 Seguridad
      - Todos los endpoints (excepto auth) requieren JWT Bearer token
      - Los usuarios solo pueden acceder a sus propios workspaces
      - Solo usuarios admin reciben token JWT en login
      
      ## 📋 Flujo básico
      1. **POST /auth/login** - Autenticarse (solo admin recibe token)
      2. **GET /workspaces** - Ver mis workspaces
      3. **GET /workspaces/{id}/full** - Cargar workspace completo
      4. **POST /tasks** - Crear nuevas tareas
      5. **PUT /tasks/{id}** - Actualizar estado de tareas
    `)
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'bearer',
    )
    .addTag('auth', '🔐 Autenticación y gestión de usuarios')
    .addTag('workspaces', '🏢 Espacios de trabajo (solo mis workspaces)')
    .addTag('boards', '📋 Tableros Kanban')
    .addTag('lists', '📝 Listas de tareas')
    .addTag('tasks', '✅ Tareas y asignaciones')
    .addTag('users', '👥 Gestión de usuarios')
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
