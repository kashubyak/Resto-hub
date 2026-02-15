import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type {
	ILoginRequest,
	ILoginResponse,
	ILogoutResponse,
	IRefreshTokenResponse,
} from '@/types/auth.interface'
import api, { getSubdomainFromHostname, refreshApi, setApiSubdomain } from '@/utils/api'

export const login = async (
	data: ILoginRequest,
): Promise<ApiResponse<ILoginResponse>> => {
	const hostnameSubdomain = getSubdomainFromHostname()
	const subdomain = hostnameSubdomain || data.subdomain

	if (hostnameSubdomain && hostnameSubdomain !== data.subdomain) {
		throw new Error('Subdomain mismatch: URL subdomain does not match input')
	}

	setApiSubdomain(subdomain)

	const response = await api.post<ILoginResponse>(
		API_URL.AUTH.LOGIN,
		{
			email: data.email,
			password: data.password,
		},
		{ withCredentials: true },
	)

	return response
}

/**
 * Refresh access token using httpOnly refresh token cookie.
 * New tokens are set automatically by the backend.
 */
export const refreshToken = async (): Promise<ApiResponse<IRefreshTokenResponse>> => {
	const response = await refreshApi.post<IRefreshTokenResponse>(
		API_URL.AUTH.REFRESH,
		{},
		{ withCredentials: true },
	)
	return response
}

/**
 * Logout user and clear all auth cookies on the server.
 */
export const logout = async (): Promise<ApiResponse<ILogoutResponse>> => {
	const response = await api.post<ILogoutResponse>(
		API_URL.AUTH.LOGOUT,
		{},
		{ withCredentials: true },
	)

	return response
}
