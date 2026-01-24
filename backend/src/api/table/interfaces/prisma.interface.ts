import { type Prisma } from '@prisma/client'

export type { IOrderDirection } from 'src/common/interface/prisma.interface'

export type ITableWhereInput = Prisma.TableWhereInput
export type ITableOrderByInput = Prisma.TableOrderByWithRelationInput
export type ITableUpdateInput = Prisma.TableUpdateInput
export type ITableCreateInput = Prisma.TableUncheckedCreateInput
