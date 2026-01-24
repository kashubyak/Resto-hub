import { type Prisma } from '@prisma/client'

export type ICategoryWhereInput = Prisma.CategoryWhereInput

export type ICategoryOrderByInput = Prisma.CategoryOrderByWithRelationInput

export type ICategorySortBy = 'name' | 'createdAt' | 'updatedAt'

export type IOrderDirection = 'asc' | 'desc'
