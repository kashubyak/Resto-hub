import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from 'prisma/prisma.service'
import { IJwtPayload } from '../interfaces/jwt.interface'
import { IJwtUser } from '../interfaces/user.interface'

const ACCESS_TOKEN_COOKIE = 'access_token'

const cookieExtractor = (req: Request): string | null => {
	const value = req.cookies[ACCESS_TOKEN_COOKIE] as string | undefined
	return typeof value === 'string' ? value : null
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		configService: ConfigService,
		private readonly prisma: PrismaService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				cookieExtractor,
				ExtractJwt.fromAuthHeaderAsBearerToken(),
			]),
			secretOrKey: configService.getOrThrow('JWT_TOKEN_SECRET'),
		})
	}

	async validate(payload: IJwtPayload): Promise<IJwtUser> {
		const user = await this.prisma.user.findUnique({
			where: { id: payload.sub },
			select: { id: true, role: true, companyId: true },
		})
		if (!user) throw new UnauthorizedException()
		return user
	}
}
