import { API_URL } from '@/config/api'
import { AUTH } from '@/constants/auth.constant'
import type { ApiResponse } from '@/types/api.interface'
import type {
	ILoginRequest,
	ILoginResponse,
	ILogoutResponse,
	IRefreshTokenResponse,
} from '@/types/auth.interface'
import api, { refreshApi, setApiSubdomain } from '@/utils/api'
import Cookies from 'js-cookie'

/**
 * Login user and receive JWT tokens via httpOnly cookies.
 * Access token (15 min) and refresh token (7 days) are set automatically by the backend.
 */
export const login = async (
	data: ILoginRequest,
): Promise<ApiResponse<ILoginResponse>> => {
	// Store subdomain for future API calls
	Cookies.set(AUTH.SUBDOMAIN, data.subdomain, {
		expires: 365,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
	})
	setApiSubdomain(data.subdomain)

	// Login - tokens are set via httpOnly cookies by backend
	const response = await api.post<ILoginResponse>(
		API_URL.AUTH.LOGIN,
		{
			email: data.email,
			password: data.password,
		},
		{ withCredentials: true }, // Required for httpOnly cookies
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

	// Clear local subdomain cookie (not managed by backend)
	Cookies.remove(AUTH.SUBDOMAIN)

	return response
}
