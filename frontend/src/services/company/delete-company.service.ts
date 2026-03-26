import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { ICompanyInfo } from '@/types/company.interface'
import api from '@/utils/api'

export const deleteCompanyService = async (): Promise<
	ApiResponse<ICompanyInfo>
> => {
	return api.delete<ICompanyInfo>(API_URL.COMPANY.ROOT)
}
