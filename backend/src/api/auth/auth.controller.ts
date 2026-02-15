import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Res,
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer/interceptors'
import {
	ApiBearerAuth,
	ApiBody,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiTooManyRequestsResponse,
} from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import { Response } from 'express'
import { Public } from 'src/common/decorators/public.decorator'
import { multerOptions } from 'src/common/s3/file-upload.util'
import { AuthService } from './auth.service'
import { RegisterCompanyDto } from './dto/request/register-company.dto'
import { RegisterCompanyResponseDto } from './dto/response/register-company-response.dto'
import { ICompanyRegistrationFiles } from './interfaces/file-upload.interface'
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register-company')
	@Public()
	@Throttle({ default: { limit: 3, ttl: 60000 } })
	@UseInterceptors(
		FileFieldsInterceptor(
			[
				{ name: 'logoUrl', maxCount: 1 },
				{ name: 'avatarUrl', maxCount: 1 },
			],
			multerOptions as unknown as Parameters<typeof FileFieldsInterceptor>[1],
		),
	)
	@ApiOperation({ description: 'Register a new company' })
	@ApiBody({ type: RegisterCompanyDto })
	@ApiCreatedResponse({
		description: 'Company registered successfully.',
		type: RegisterCompanyResponseDto,
	})
	@ApiTooManyRequestsResponse({
		description: 'Too many registration attempts.',
	})
	registerCompany(
		@Body() dto: RegisterCompanyDto,
		@UploadedFiles()
		files: ICompanyRegistrationFiles,
		@Res({ passthrough: true }) res: Response,
	): Promise<Omit<RegisterCompanyResponseDto, 'refresh_token'>> {
		return this.authService.registerCompany(dto, files, res)
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	@ApiBearerAuth('access-token')
	@ApiOperation({ description: 'Log out the current user.' })
	@ApiOkResponse({
		description: 'Logged out successfully.',
	})
	logout(@Res({ passthrough: true }) res: Response) {
		return this.authService.logoutUser(res)
	}
}
