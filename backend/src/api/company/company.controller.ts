import {
	Body,
	Controller,
	Delete,
	Get,
	Patch,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor'
import {
	ApiBearerAuth,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger'
import { Role } from '@prisma/client'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { Roles } from 'src/common/decorators/roles.decorator'
import { type IOptionalFile } from 'src/common/interface/file-upload.interface'
import { multerOptions } from 'src/common/s3/file-upload.util'
import { CompanyService } from './company.service'
import { UpdateCompanyDto } from './dto/request/update-company.dto'
import { CompanyItemDto } from './dto/response/company-item-dto'

@ApiTags('Company')
@ApiBearerAuth()
@Controller('company')
export class CompanyController {
	constructor(private readonly companyService: CompanyService) {}

	@Get()
	@Roles(Role.ADMIN)
	@ApiOperation({ description: 'Get current company info (ADMIN only)' })
	@ApiOkResponse({ type: CompanyItemDto })
	getCompany(@CurrentUser('companyId') companyId: number) {
		return this.companyService.getCompanyById(companyId)
	}

	@Patch()
	@Roles(Role.ADMIN)
	@UseInterceptors(
		FileInterceptor(
			'logoUrl',
			multerOptions as unknown as Parameters<typeof FileInterceptor>[1],
		),
	)
	@ApiOperation({ description: 'Update current company info (ADMIN only)' })
	@ApiOkResponse({ type: UpdateCompanyDto })
	updateCompany(
		@Body() dto: UpdateCompanyDto,
		@UploadedFile() file: IOptionalFile,
		@CurrentUser('companyId') companyId: number,
	) {
		return this.companyService.updateCompany(companyId, dto, file)
	}

	@Delete()
	@Roles(Role.ADMIN)
	@ApiOperation({ description: 'Delete current company (ADMIN only)' })
	@ApiOkResponse({ type: CompanyItemDto })
	deleteCompany(@CurrentUser('companyId') companyId: number) {
		return this.companyService.deleteCompany(companyId)
	}
}
