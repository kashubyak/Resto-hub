import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req,
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
} from '@nestjs/swagger'
import { Response } from 'express'
import { Public } from 'src/common/decorators/public.decorator'
import { IRequestWithCompanyId } from 'src/common/interface/request.interface'
import { multerOptions } from 'src/common/s3/file-upload.util'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/request/login.dto'
import { RegisterCompanyDto } from './dto/request/register-company.dto'
import { RegisterCompanyResponseDto } from './dto/response/register-company-response.dto'
import { ICompanyRegistrationFiles } from './interfaces/file-upload.interface'
import { ITokenResponse } from './interfaces/jwt.interface'

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register-company')
	@Public()
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
	registerCompany(
		@Body() dto: RegisterCompanyDto,
		@UploadedFiles()
		files: ICompanyRegistrationFiles,
		@Res({ passthrough: true }) res: Response,
	): Promise<Omit<RegisterCompanyResponseDto, 'refresh_token'>> {
		return this.authService.registerCompany(dto, files, res)
	}

	@Post('login')
	@Public()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		description: 'Log in and get JWT token which expires in 1 day.',
	})
	@ApiBody({ type: LoginDto })
	@ApiOkResponse({
		description: 'Signed in successfully.',
		schema: {
			example: {
				token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
			},
		},
	})
	async login(
		@Body() dto: LoginDto,
		@Req() req: IRequestWithCompanyId,
		@Res({ passthrough: true }) res: Response,
	): Promise<ITokenResponse> {
		return this.authService.processLogin(dto, req, res)
	}

	@Post('refresh')
	@Public()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		description: 'Refresh access token using cookie-based refresh token.',
	})
	@ApiOkResponse({
		description: 'Token refreshed successfully.',
		schema: {
			example: {
				token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
			},
		},
	})
	async refresh(
		@Req() req: IRequestWithCompanyId,
		@Res({ passthrough: true }) res: Response,
	): Promise<ITokenResponse> {
		return this.authService.processRefresh(req, res)
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
