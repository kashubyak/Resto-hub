import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { ThrottlerModule } from '@nestjs/throttler'
import { PrismaService } from 'prisma/prisma.service'
import { SupabaseService } from 'src/common/supabase/supabase.service'
import { S3Service } from 'src/common/s3/s3.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { SupabaseJwtStrategy } from './strategies/supabase-jwt.strategy'

@Module({
	imports: [
		PassportModule,
		ConfigModule,
		ThrottlerModule.forRoot([{ limit: 10, ttl: 60 }]),
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		SupabaseJwtStrategy,
		PrismaService,
		SupabaseService,
		S3Service,
	],
	exports: [SupabaseJwtStrategy],
})
export class AuthModule {}
