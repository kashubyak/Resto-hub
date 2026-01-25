import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ThrottlerModule } from '@nestjs/throttler'
import { PrismaService } from 'prisma/prisma.service'
import { S3Service } from 'src/common/s3/s3.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				secret: configService.getOrThrow<string>('JWT_TOKEN_SECRET'),
				signOptions: {
					expiresIn: configService.get<string>('JWT_EXPIRES_IN', '15m'),
				},
			}),
		}),
		ThrottlerModule.forRoot([{ limit: 10, ttl: 60 }]),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, PrismaService, S3Service],
})
export class AuthModule {}
