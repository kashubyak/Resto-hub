import { type Prisma } from '@prisma/client'
import { type ICommonSortFields } from 'src/common/interface/prisma.interface'

export type { IOrderDirection } from 'src/common/interface/prisma.interface'

export type IUserWhereInput = Prisma.UserWhereInput
export type IUserOrderByInput = Prisma.UserOrderByWithRelationInput
export type IUserUpdateInput = Prisma.UserUpdateInput
export type IUserCreateInput = Prisma.UserUncheckedCreateInput

export type IUserSortBy = 'name' | 'email' | ICommonSortFields
