import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { company_avatar } from 'src/common/constants';
import { S3Service } from 'src/common/s3/s3.service';
import { UpdateCompanyDto } from './dto/request/update-company.dto';
import { CompanyRepository } from './repository/company.repository';

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly s3Service: S3Service,
    private readonly prisma: PrismaService,
  ) {}

  async getCompanyById(companyId: number) {
    const company = await this.companyRepository.findById(companyId);
    if (!company)
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    return company;
  }

  async updateCompany(
    companyId: number,
    dto: UpdateCompanyDto,
    file?: Express.Multer.File,
  ) {
    const company = await this.companyRepository.findById(companyId);
    if (!company)
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    if (dto.name && dto.name !== company.name) {
      const existing = await this.companyRepository.findByName(dto.name);
      if (existing) {
        throw new ConflictException(
          `Company with name ${dto.name} already exists`,
        );
      }
    }
    let logoUrl = company.logoUrl;
    if (file) {
      await this.s3Service.deleteFile(logoUrl);
      logoUrl = await this.s3Service.uploadFile(file, company_avatar);
    }
    return this.companyRepository.update(companyId, {
      ...dto,
      logoUrl,
    } as Prisma.CompanyUpdateInput);
  }

  async deleteCompany(companyId: number) {
    const company = await this.companyRepository.findById(companyId);
    if (!company)
      throw new NotFoundException(`Company with ID ${companyId} not found`);

    await this.s3Service.deleteFile(company.logoUrl);
    await this.prisma.$transaction([
      this.prisma.order.deleteMany({ where: { companyId } }),
      this.prisma.dish.deleteMany({ where: { companyId } }),
      this.prisma.category.deleteMany({ where: { companyId } }),
      this.prisma.table.deleteMany({ where: { companyId } }),
      this.prisma.user.deleteMany({ where: { companyId } }),
      this.prisma.company.delete({ where: { id: companyId } }),
    ]);
    return company;
  }
}
