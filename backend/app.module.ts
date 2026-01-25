import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { PrismaService } from 'prisma/prisma.service';
import { JwtAuthGuard } from 'src/api/auth/guards/jwt.guard';
import { RolesGuard } from 'src/api/auth/guards/roles.guard';
import { CategoryModule } from 'src/api/category/category.module';
import { CompanyModule } from 'src/api/company/company.module';
import { DishModule } from 'src/api/dish/dish.module';
import { OrderModule } from 'src/api/order/order.module';
import { TableModule } from 'src/api/table/table.module';
import { UserModule } from 'src/api/user/user.module';
import { PrismaExceptionFilter } from 'src/common/filters/prisma-exception.filter';
import { CompanyConsistencyGuard } from 'src/common/guards/company-consistency.guard';
import { SubdomainGuard } from 'src/common/guards/subdomain.guard';
import { AuthModule } from './src/api/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? ['.env.test', '.env'] : ['.env'],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'build'),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    AuthModule,
    CategoryModule,
    DishModule,
    OrderModule,
    TableModule,
    UserModule,
    CompanyModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: SubdomainGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: CompanyConsistencyGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
  ],
})
export class AppModule {}
