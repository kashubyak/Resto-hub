import {
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_KEY } from 'src/common/constants'
import { IAuthenticatedUser } from '../interfaces/user.interface'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(private reflector: Reflector) {
		super()
	}

	canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		])
		if (isPublic) return true
		return super.canActivate(context) as Promise<boolean>
	}

	override handleRequest<TUser extends IAuthenticatedUser = IAuthenticatedUser>(
		err: unknown,
		user: TUser,
		_info: unknown,
		_context: ExecutionContext,
		_status?: unknown,
	): TUser {
		if (err) throw err instanceof Error ? err : new UnauthorizedException()
		if (!user) throw new UnauthorizedException()
		return user
	}
}
