import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('E-Business Platform API')
    .setDescription('API documentation for the E-Business Platform Prototype')
    .setVersion('1.0')
    .addTag('catalog')
    .addTag('quotation')
    .addTag('transactional')
    .addTag('logistics')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
