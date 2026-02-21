import { API_URL } from '@/config/api'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { ApiResponse } from '@/types/api.interface'
import type {
	ILoginRequest,
	ILoginResponse,
	ILogoutResponse,
} from '@/types/auth.interface'
import api, {
	getSubdomainFromHostname,
	initApiSubdomain,
	setApiSubdomain,
} from '@/utils/api'

export const login = async (
	data: ILoginRequest,
): Promise<ApiResponse<ILoginResponse>> => {
	const hostnameSubdomain = getSubdomainFromHostname()
	const subdomain = data.subdomain || hostnameSubdomain

	setApiSubdomain(subdomain)

	const response = await api.post<ILoginResponse>(
		API_URL.AUTH.LOGIN,
		{ email: data.email, password: data.password, subdomain },
		{
			withCredentials: true,
			...(data.subdomain && { headers: { 'X-Subdomain': data.subdomain } }),
		},
	)
	return response
}

export const logout = async (): Promise<ApiResponse<ILogoutResponse>> => {
	initApiSubdomain()
	try {
		const response = await api.post<ILogoutResponse>(
			API_URL.AUTH.LOGOUT,
			{},
			{ withCredentials: true },
		)
		await getSupabaseClient().auth.signOut()
		return response
	} catch (err) {
		await getSupabaseClient().auth.signOut()
		throw err
	}
}
