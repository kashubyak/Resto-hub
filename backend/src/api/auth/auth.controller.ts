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
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/requests/login.dto';
import { RegisterDto } from './dto/requests/register.dto';
import { RegisterResponseDto } from './dto/responses/register-response.dto';
import { TokenResponseDto } from './dto/responses/token-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ description: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully.',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email already in use.',
    schema: {
      example: {
        statusCode: 409,
        message: 'Email already in use',
        error: 'Conflict',
      },
    },
  })
  async register(
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
  @ApiResponse({
    status: 200,
    description: 'Signed in successfully.',
    schema: {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
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
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully.',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid refresh token',
        error: 'Unauthorized',
      },
    },
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
  @ApiResponse({
    status: 200,
    description: 'Logged out successfully.',
    schema: {
      example: {
        message: 'Logged out successfully',
      },
    },
  })
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logoutUser(res);
  }
}
