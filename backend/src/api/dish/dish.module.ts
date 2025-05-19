import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { DishController } from './dish.controller';
import { DishService } from './dish.service';
import { DishRepository } from './repository/dish.repository';

@Module({
  controllers: [DishController],
  providers: [DishService, DishRepository, PrismaService],
})
export class DishModule {}
