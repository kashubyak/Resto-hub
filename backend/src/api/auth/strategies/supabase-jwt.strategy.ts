import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { createRemoteJWKSet, jwtVerify } from 'jose'
import { Request } from 'express'
import { PrismaService } from 'prisma/prisma.service'
import { companyIdFromSubdomain, IS_PUBLIC_KEY } from 'src/common/constants'
import { IRequestWithCompanyId } from 'src/common/interface/request.interface'
import { IAuthenticatedUser } from '../interfaces/user.interface'

@Injectable()
export class SupabaseJwtStrategy implements CanActivate {
	private readonly jwks: ReturnType<typeof createRemoteJWKSet>

	constructor(
		configService: ConfigService,
		private readonly prisma: PrismaService,
		private readonly reflector: Reflector,
	) {
		const supabaseUrl = configService.getOrThrow<string>('SUPABASE_URL')
		this.jwks = createRemoteJWKSet(
			new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`),
		)
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		])
		if (isPublic) return true

		const req = context.switchToHttp().getRequest<Request>()
		const authHeader = req.headers.authorization
		const token: string | undefined = authHeader?.startsWith('Bearer ')
			? authHeader.slice(7)
			: (req.cookies['access_token'] as string | undefined)

		if (typeof token !== 'string')
			throw new UnauthorizedException('No token provided')

		let sub: string
		try {
			const { payload } = await jwtVerify(token, this.jwks)
			sub = payload.sub as string
			if (!sub) throw new Error('Missing sub')
		} catch {
			throw new UnauthorizedException('Invalid token')
		}

		const companyId = (req as IRequestWithCompanyId)[companyIdFromSubdomain]
		if (!companyId)
			throw new UnauthorizedException('Company subdomain not found')

		const user = await this.prisma.user.findFirst({
			where: {
				supabaseUserId: sub,
				companyId,
			} as { supabaseUserId: string; companyId: number },
			select: { id: true, role: true, companyId: true },
		})

		if (!user) throw new UnauthorizedException('User not found in company')
		;(req as Request & { user: IAuthenticatedUser }).user = user
		return true
	}
}
