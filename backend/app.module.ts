import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaService } from 'prisma/prisma.service';
import { CategoryModule } from 'src/api/category/category.module';
import { DishModule } from 'src/api/dish/dish.module';
import { OrderModule } from 'src/api/order/order.module';
import { TableModule } from 'src/api/table/table.module';
import { PrismaExceptionFilter } from 'src/common/filters/prisma-exception.filter';
import { AuthModule } from './src/api/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', `./configs/.env.${process.env.NODE_ENV}`],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'build'),
    }),

    AuthModule,
    CategoryModule,
    DishModule,
    OrderModule,
    TableModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
  ],
})
export class AppModule {}
