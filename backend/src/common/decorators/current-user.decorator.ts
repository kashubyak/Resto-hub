import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import { type IAuthenticatedUser } from 'src/api/auth/interfaces/user.interface'
import { companyIdFromSubdomain } from '../constants'
import { type IRequestWithUser } from '../interface/request.interface'

export const CurrentUser = createParamDecorator(
	(field: string | undefined, ctx: ExecutionContext): unknown => {
		const request = ctx.switchToHttp().getRequest<IRequestWithUser>()
		const user: IAuthenticatedUser | undefined = request.user
		if (user && !user.companyId && request[companyIdFromSubdomain])
			user.companyId = request[companyIdFromSubdomain]

		if (!field) return user
		if (!user) return undefined
		return (user as unknown as Record<string, unknown>)[field]
	},
)
