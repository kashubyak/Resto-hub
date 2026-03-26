import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { CustomAxiosRequestConfig } from '@/types/axios.interface'
import type { ICompanyInfo } from '@/types/company.interface'
import api from '@/utils/api'

export interface IUpdateCompanyFormPayload {
	name?: string
	address?: string
	latitude?: number
	longitude?: number
	logoFile?: File | null
}

export const buildUpdateCompanyFormData = (
	data: IUpdateCompanyFormPayload,
): FormData => {
	const formData = new FormData()
	if (data.name !== undefined) formData.append('name', data.name)
	if (data.address !== undefined) formData.append('address', data.address)
	if (data.latitude !== undefined)
		formData.append('latitude', String(data.latitude))
	if (data.longitude !== undefined)
		formData.append('longitude', String(data.longitude))
	if (data.logoFile) formData.append('logoUrl', data.logoFile)
	return formData
}

export const updateCompanyService = async (
	formData: FormData,
	config?: CustomAxiosRequestConfig,
): Promise<ApiResponse<ICompanyInfo>> => {
	return api.patch<ICompanyInfo>(API_URL.COMPANY.ROOT, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		...config,
	})
}
