import { type Prisma } from '@prisma/client'

export type { IOrderDirection, ICommonSortFields } from 'src/common/interface/prisma.interface'

export type IDishWhereInput = Prisma.DishWhereInput

export type IDishUpdateInput = Prisma.DishUpdateInput

export type IDishOrderByInput = Prisma.DishOrderByWithRelationInput

export type IDishSortBy = 'name' | 'price' | Extract<ICommonSortFields, 'createdAt'>
