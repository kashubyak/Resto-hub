import { type Request } from 'express'
import { type IAuthenticatedUser } from 'src/api/auth/interfaces/user.interface'
import { type companyIdFromSubdomain } from '../constants'

export interface IRequestWithCompanyId extends Request {
	[companyIdFromSubdomain]?: number
	companyIdFromSubdomain?: number
}

export interface IRequestWithUser extends IRequestWithCompanyId {
	user?: IAuthenticatedUser
}
