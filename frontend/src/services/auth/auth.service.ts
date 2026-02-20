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
	try {
		const hostnameSubdomain = getSubdomainFromHostname()
		const subdomain = data.subdomain || hostnameSubdomain

		setApiSubdomain(subdomain)

		const supabase = getSupabaseClient()
		const { data: authData, error } = await supabase.auth.signInWithPassword({
			email: data.email,
			password: data.password,
		})

		if (error) throw error
		if (!authData.session)
			throw new Error('Login succeeded but no session returned')

		const response = await api.post<ILoginResponse>(API_URL.AUTH.LOGIN, data, {
			withCredentials: true,
		})
		return response
	} catch (err: unknown) {
		const axiosErr = err as {
			response?: unknown
			message?: string
			config?: { url?: string }
		}
		console.error('[auth.service] login failed', {
			message: axiosErr?.message ?? (err as Error)?.message,
			response: axiosErr?.response,
			url: axiosErr?.config?.url,
			err,
		})
		throw err
	}
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
