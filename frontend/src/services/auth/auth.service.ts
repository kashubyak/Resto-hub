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
	const subdomain = hostnameSubdomain || data.subdomain

	if (hostnameSubdomain && hostnameSubdomain !== data.subdomain) {
		throw new Error('Subdomain mismatch: URL subdomain does not match input')
	}

	setApiSubdomain(subdomain)

	const supabase = getSupabaseClient()
	const { data: authData, error } = await supabase.auth.signInWithPassword({
		email: data.email,
		password: data.password,
	})

	if (error) throw error
	if (!authData.session)
		throw new Error('Login succeeded but no session returned')

	await api.post<ILoginResponse>(API_URL.AUTH.LOGIN, data, {
		withCredentials: true,
	})

	return {
		status: 200,
		statusText: 'OK',
		headers: {},
		config: { headers: {} } as never,
		data: {
			success: true,
			user: { id: 0, role: authData.user?.user_metadata?.role ?? 'WAITER' },
		},
	} as ApiResponse<ILoginResponse>
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
