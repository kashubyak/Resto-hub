import { type User } from '@prisma/client'
import {
	type IFindManyArgs,
	type IFindManyResult,
} from 'src/common/interface/repository.interface'
import {
	type IUserOrderByInput,
	type IUserWhereInput,
} from './prisma.interface'
import {
	type IUserRecord,
	type IUserWithCompanyId,
	type IUserWithPassword,
} from './user.interface'

export type IFindUsersArgs = IFindManyArgs<IUserWhereInput, IUserOrderByInput>

export type IFindUsersResult<T> = IFindManyResult<T>

export type IUserRepositoryResult = IUserRecord

export type IUserWithCompanyIdResult = IUserWithCompanyId

export type IUserWithPasswordResult = IUserWithPassword

export type IUserRepositoryResultOrNull = IUserRecord | null

export type IUserFullResult = User

export type IUserFullResultOrNull = User | null
