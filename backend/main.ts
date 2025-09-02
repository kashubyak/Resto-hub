import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { PrismaService } from 'prisma/prisma.service';
import { PrismaExceptionFilter } from 'src/common/filters/prisma-exception.filter';
import { CompanyContextMiddleware } from 'src/common/middleware/company-context.middleware';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useWebSocketAdapter(new IoAdapter(app));

  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  });

  const prisma = app.get(PrismaService);
  const middleware = new CompanyContextMiddleware(prisma);
  app.use(middleware.use.bind(middleware));
  const config = new DocumentBuilder()
    .setTitle('Resto-Hub API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  });

  await app.listen(
    Number(process.env.PORT) || 3000,
    process.env.HOST || '0.0.0.0',
  );
}
bootstrap();
