import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TableRepository } from './repository/table.repository';
import { TableController } from './table.controller';
import { TableService } from './table.service';

@Module({
  controllers: [TableController],
  providers: [TableService, TableRepository, PrismaService],
  exports: [TableService],
})
export class TableModule {}
