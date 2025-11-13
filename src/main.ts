// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  console.log(`Starting server on port ${port}...`);
  const app = await NestFactory.create(AppModule);

  // Le decimos a nuestra app que use el "guardia de seguridad" para validar los datos
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // --- AÑADE ESTA LÍNEA AQUÍ ---
  // Esto es como decirle al portero: "Oye, deja entrar a todo el mundo que venga a preguntar, no hay problema".
  app.enableCors();
  // --- FIN DEL CAMBIO ---

  const config = new DocumentBuilder()
    .setTitle('sis-core-api')
    .setDescription('The sis-core-api description')
    .setVersion('1.0')
    .addTag('sis-core-api')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(port);
  console.log(`🚀 App is running on http://localhost:${port}`);
}

bootstrap();
