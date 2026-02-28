import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { PrismaExceptionFilter } from 'src/common/filters/prisma-exception.filter';
import { CompanyContextMiddleware } from 'src/common/middleware/company-context.middleware';
import { AppModule } from '../app.module';

let app: any;

async function createApp() {
	if (app) return app;

	const expressApp = express();
	const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

	const httpAdapter = nestApp.getHttpAdapter();
	const instance = httpAdapter.getInstance();
	(instance as { set: (name: string, value: number) => void }).set('trust proxy', 1);

	nestApp.setGlobalPrefix('api');
	nestApp.use(cookieParser());
	nestApp.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);
	nestApp.useGlobalFilters(new PrismaExceptionFilter());

	const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map((o) => o.trim()) || [];
	const isDev = process.env.NODE_ENV === 'development';

	nestApp.enableCors({
		origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
			if (!origin) {
				callback(null, true);
				return;
			}
			if (allowedOrigins.includes(origin)) {
				callback(null, true);
				return;
			}
			if (isDev && (/^https?:\/\/lvh\.me(:\d+)?$/.test(origin) || /^https?:\/\/[^.]+\.lvh\.me(:\d+)?$/.test(origin))) {
				callback(null, true);
				return;
			}
			callback(new Error(`Not allowed by CORS: ${origin}`));
		},
		credentials: true,
	});

	const prisma = nestApp.get(PrismaService);
	const middleware = new CompanyContextMiddleware(prisma);
	nestApp.use(middleware.use.bind(middleware));

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

	const document = SwaggerModule.createDocument(nestApp, config);
	SwaggerModule.setup('api/docs', nestApp, document, {
		swaggerOptions: {
			persistAuthorization: true,
			displayRequestDuration: true,
		},
	});

	await nestApp.init();
	app = expressApp;
	return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
	try {
		const expressApp = await createApp();
		return expressApp(req, res);
	} catch (error) {
		console.error('[Vercel Handler] Error:', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
}
