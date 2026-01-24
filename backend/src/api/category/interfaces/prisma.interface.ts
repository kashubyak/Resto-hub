import { type Prisma } from '@prisma/client'

export type { IOrderDirection, ICommonSortFields } from 'src/common/interface/prisma.interface'

export type ICategoryWhereInput = Prisma.CategoryWhereInput

export type ICategoryOrderByInput = Prisma.CategoryOrderByWithRelationInput

export type ICategorySortBy = 'name' | ICommonSortFields
