import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { S3Service } from 'src/common/s3/s3.service';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { CompanyRepository } from './repository/company.repository';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRepository, PrismaService, S3Service],
})
export class CompanyModule {}
