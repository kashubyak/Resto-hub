import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/request/login.dto';
import { RegisterDto } from './dto/request/register.dto';
import { RegisterResponseDto } from './dto/response/register-response.dto';
import { TokenResponseDto } from './dto/response/token-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ description: 'Register a new user (admin only)' })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({
    description: 'User registered successfully.',
    type: RegisterResponseDto,
  })
  register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<RegisterResponseDto, 'refresh_token'>> {
    return this.authService.registerUser(dto, res);
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
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ token: string }> {
    return this.authService.processLogin(dto, res);
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Refresh access token using cookie-based refresh token.',
  })
  @ApiOkResponse({
    description: 'Token refreshed successfully.',
    type: TokenResponseDto,
  })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ token: string }> {
    return this.authService.processRefresh(req, res);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ description: 'Log out the current user.' })
  @ApiOkResponse({
    description: 'Logged out successfully.',
  })
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logoutUser(res);
  }
}
