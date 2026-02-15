import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { ICompanyInfo } from '@/types/company.interface'
import api from '@/utils/api'

export const getCompany = async (): Promise<ApiResponse<ICompanyInfo>> => {
	const response = await api.get<ICompanyInfo>(API_URL.COMPANY.ROOT)
	return response
}
