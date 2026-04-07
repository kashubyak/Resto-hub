import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { CustomAxiosRequestConfig } from '@/types/axios.interface'
import type {
	IGetOrderAnalyticsParams,
	IOrderAnalyticsRow,
} from '@/types/order.interface'
import api from '@/utils/api'

function buildAnalyticsSearchParams(
	params: IGetOrderAnalyticsParams,
): URLSearchParams {
	const sp = new URLSearchParams()
	if (params.groupBy) sp.append('groupBy', params.groupBy)
	if (params.metric) sp.append('metric', params.metric)
	if (params.from) sp.append('from', params.from)
	if (params.to) sp.append('to', params.to)
	for (const id of params.dishIds ?? []) sp.append('dishIds', String(id))
	for (const id of params.categoryIds ?? [])
		sp.append('categoryIds', String(id))
	for (const id of params.waiterIds ?? []) sp.append('waiterIds', String(id))
	for (const id of params.cookIds ?? []) sp.append('cookIds', String(id))
	for (const id of params.tableIds ?? []) sp.append('tableIds', String(id))
	return sp
}

export const getOrderAnalyticsService = async (
	params?: IGetOrderAnalyticsParams,
	config?: CustomAxiosRequestConfig,
): Promise<ApiResponse<IOrderAnalyticsRow[]>> =>
	api.get<IOrderAnalyticsRow[]>(API_URL.ORDER.ANALYTICS, {
		params: buildAnalyticsSearchParams(params ?? {}),
		...config,
	})
