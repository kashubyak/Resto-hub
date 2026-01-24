import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import { companyIdFromSubdomain } from '../constants'

export const CurrentUser = createParamDecorator(
	(field: string | undefined, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		const user = request.user
		if (user && !user.companyId && request[companyIdFromSubdomain])
			user.companyId = request[companyIdFromSubdomain]

		return field ? user?.[field] : user
	},
)
