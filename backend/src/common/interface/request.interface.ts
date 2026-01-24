import { Request } from 'express'
import { IAuthenticatedUser } from 'src/api/auth/interfaces/user.interface'
import { companyIdFromSubdomain } from '../constants'

export interface IRequestWithCompanyId extends Request {
  [companyIdFromSubdomain]?: number
  companyIdFromSubdomain?: number
}

export interface IRequestWithUser extends IRequestWithCompanyId {
  user?: IAuthenticatedUser
}
