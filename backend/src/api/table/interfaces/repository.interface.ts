import { type Table } from '@prisma/client'
import { type IDeleteResult } from 'src/common/interface/repository.interface'

export type ITableRepositoryResult = Table
export type ITableRepositoryResultOrNull = Table | null
export type ITableRepositoryResultArray = Table[]

export type { IDeleteResult }
