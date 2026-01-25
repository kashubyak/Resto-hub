import { Module } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { S3Service } from 'src/common/s3/s3.service'
import { UserRepository } from './repository/user.repository'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
	controllers: [UserController],
	providers: [UserService, UserRepository, PrismaService, S3Service],
})
export class UserModule {}
