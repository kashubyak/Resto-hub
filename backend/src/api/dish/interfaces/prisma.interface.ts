import { type Prisma } from '@prisma/client'

export type IDishWhereInput = Prisma.DishWhereInput

export type IDishUpdateInput = Prisma.DishUpdateInput

export type IDishOrderByInput = Prisma.DishOrderByWithRelationInput

export type IDishSortBy = 'name' | 'price' | 'createdAt'

export type IOrderDirection = 'asc' | 'desc'
