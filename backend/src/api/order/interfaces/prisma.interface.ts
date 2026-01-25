import { type Prisma } from '@prisma/client'
import { type ICommonSortFields } from 'src/common/interface/prisma.interface'

export type { IOrderDirection } from 'src/common/interface/prisma.interface'

export type IOrderWhereInput = Prisma.OrderWhereInput
export type IOrderOrderByInput = Prisma.OrderOrderByWithRelationInput
export type IOrderUpdateInput = Prisma.OrderUpdateInput
export type IOrderCreateInput = Prisma.OrderUncheckedCreateInput

export type IOrderSortBy = ICommonSortFields | 'status'
