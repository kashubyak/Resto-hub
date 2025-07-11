import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { folder_avatar } from 'src/common/constants';
import { S3Service } from 'src/common/s3/s3.service';
import { LoginDto } from './dto/request/login.dto';
import { RegisterDto } from './dto/request/register.dto';
import { RegisterResponseDto } from './dto/response/register-response.dto';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_REFRESH_TOKEN_SECRET: string;
  private readonly JWT_EXPIRES_IN = '1d';
  private readonly JWT_REFRESH_EXPIRES_IN = '30d';

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly S3Service: S3Service,
  ) {
    this.JWT_SECRET = this.configService.getOrThrow('JWT_TOKEN_SECRET');
    this.JWT_REFRESH_TOKEN_SECRET = this.configService.getOrThrow(
      'JWT_REFRESH_TOKEN_SECRET',
    );
  }

  async registerUser(
    dto: RegisterDto,
    file: Express.Multer.File,
    res: Response,
  ): Promise<Omit<RegisterResponseDto, 'refresh_token'>> {
    if (!file) throw new BadRequestException('Avatar image is required');
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (dto.role !== 'ADMIN')
      throw new ForbiddenException('Only ADMIN can be registered here');
    if (existingUser) throw new ConflictException('Email already in use');
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const avatarUrl = await this.S3Service.uploadFile(file, folder_avatar);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
        avatarUrl,
      },
    });

    const token = await this.getAccessToken(user.id, user.role);
    const refreshToken = await this.getRefreshToken(user.id, user.role);
    this.setRefreshTokenCookie(res, refreshToken);

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  async processLogin(dto: LoginDto, res: Response): Promise<{ token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.getAccessToken(user.id, user.role);
    const refreshToken = await this.getRefreshToken(user.id, user.role);
    this.setRefreshTokenCookie(res, refreshToken);

    return { token };
  }

  async processRefresh(
    req: Request,
    res: Response,
  ): Promise<{ token: string }> {
    const refreshToken = req.cookies['jid'];
    if (!refreshToken)
      throw new UnauthorizedException('No refresh token provided');

    let payload: { sub: number; role: string };
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.JWT_REFRESH_TOKEN_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const token = await this.getAccessToken(payload.sub, payload.role);
    const newRefreshToken = await this.getRefreshToken(
      payload.sub,
      payload.role,
    );
    this.setRefreshTokenCookie(res, newRefreshToken);

    return { token };
  }

  logoutUser(res: Response): { message: string } {
    res.clearCookie('jid', { path: '/auth', httpOnly: true });
    return { message: 'Logged out successfully' };
  }

  private async getAccessToken(userId: number, role: string): Promise<string> {
    return this.jwtService.signAsync(
      { sub: userId, role },
      { secret: this.JWT_SECRET, expiresIn: this.JWT_EXPIRES_IN },
    );
  }

  private async getRefreshToken(userId: number, role: string): Promise<string> {
    return this.jwtService.signAsync(
      { sub: userId, role },
      {
        secret: this.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: this.JWT_REFRESH_EXPIRES_IN,
      },
    );
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string): void {
    res.cookie('jid', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }
}
