import { type ICompanyUpdateInput } from './prisma.interface'

export interface IUpdateCompanyArgs {
	companyId: number
	data: ICompanyUpdateInput
}
