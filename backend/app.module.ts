import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaService } from 'prisma/prisma.service';
import { CategoryModule } from 'src/api/category/category.module';
import { DishModule } from 'src/api/dish/dish.module';
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
  ],
  providers: [PrismaService],
})
export class AppModule {}
