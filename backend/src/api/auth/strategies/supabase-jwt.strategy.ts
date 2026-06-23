import {
	CanActivate,
	ExecutionContext,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { PrismaService } from 'prisma/prisma.service'
import { SupabaseTokenVerifierService } from 'src/common/auth/supabase-token-verifier.service'
import { companyIdFromSubdomain, IS_PUBLIC_KEY } from 'src/common/constants'
import { IRequestWithCompanyId } from 'src/common/interface/request.interface'
import { IAuthenticatedUser } from '../interfaces/user.interface'

@Injectable()
export class SupabaseJwtStrategy implements CanActivate {
	private readonly logger = new Logger(SupabaseJwtStrategy.name)

	constructor(
		private readonly tokenVerifier: SupabaseTokenVerifierService,
		private readonly prisma: PrismaService,
		private readonly reflector: Reflector,
	) {}

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

		if (typeof token !== 'string') {
			this.logger.warn('AUTH_NO_TOKEN')
			throw new UnauthorizedException('AUTH_NO_TOKEN')
		}

		let sub: string
		try {
			;({ sub } = await this.tokenVerifier.verifyAccessToken(token))
		} catch {
			this.logger.warn('AUTH_INVALID_TOKEN')
			throw new UnauthorizedException('AUTH_INVALID_TOKEN')
		}

		const companyId = (req as IRequestWithCompanyId)[companyIdFromSubdomain]
		if (!companyId) {
			this.logger.warn('AUTH_NO_COMPANY')
			throw new UnauthorizedException('AUTH_NO_COMPANY')
		}

		const user = await this.prisma.user.findFirst({
			where: {
				supabaseUserId: sub,
				companyId,
			} as { supabaseUserId: string; companyId: number },
			select: { id: true, role: true, companyId: true },
		})

		if (!user) {
			this.logger.warn('AUTH_USER_NOT_IN_COMPANY')
			throw new UnauthorizedException('AUTH_USER_NOT_IN_COMPANY')
		}
		;(req as Request & { user: IAuthenticatedUser }).user = user
		return true
	}
}
