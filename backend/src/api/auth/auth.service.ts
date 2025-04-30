import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { LoginDto } from './dto/requests/login.dto';
import { RegisterDto } from './dto/requests/register.dto';
import { RegisterResponseDto } from './dto/responses/register-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    dto: RegisterDto,
    res: Response,
  ): Promise<Omit<RegisterResponseDto, 'refresh_token'>> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
      },
    });

    const accessToken = await this.getAccessToken(user.id, user.role);
    const refreshToken = await this.getRefreshToken(user.id, user.role);

    this.setRefreshTokenCookie(res, refreshToken);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(dto: LoginDto, res: Response): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.getAccessToken(user.id, user.role);
    const refreshToken = await this.getRefreshToken(user.id, user.role);

    this.setRefreshTokenCookie(res, refreshToken);

    return { access_token: accessToken };
  }

  async refresh(
    req: Request,
    res: Response,
  ): Promise<{ access_token: string }> {
    const refreshToken = req.cookies['jid'];
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const payload = await this.verifyRefreshToken(refreshToken);

    const accessToken = await this.getAccessToken(payload.sub, payload.role);
    const newRefreshToken = await this.getRefreshToken(
      payload.sub,
      payload.role,
    );

    this.setRefreshTokenCookie(res, newRefreshToken);

    return { access_token: accessToken };
  }

  logout(res: Response): { message: string } {
    res.clearCookie('jid', { path: '/auth/refresh' });
    return { message: 'Logged out successfully' };
  }

  private async getAccessToken(userId: number, role: string): Promise<string> {
    const payload = { sub: userId, role };
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_TOKEN_SECRET,
      expiresIn: '1d',
    });
  }

  private async getRefreshToken(userId: number, role: string): Promise<string> {
    const payload = { sub: userId, role };
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: '30d',
    });
  }

  private async verifyRefreshToken(
    token: string,
  ): Promise<{ sub: number; role: string }> {
    try {
      return await this.jwtService.verifyAsync<{ sub: number; role: string }>(
        token,
        { secret: process.env.JWT_REFRESH_TOKEN_SECRET },
      );
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string): void {
    res.cookie('jid', String(refreshToken), {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }
}
