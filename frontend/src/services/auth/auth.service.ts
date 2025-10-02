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
import { convertToDays } from '@/utils/convertToDays'
import Cookies from 'js-cookie'

export const login = async (
	data: ILoginRequest,
): Promise<ApiResponse<ILoginResponse>> => {
	Cookies.set(AUTH.SUBDOMAIN, data.subdomain, {
		expires: 365,
		secure: true,
		sameSite: 'strict',
	})
	setApiSubdomain(data.subdomain)

	const response = await api.post<ILoginResponse>(API_URL.AUTH.LOGIN, {
		email: data.email,
		password: data.password,
	})

	if (response.data?.token) {
		const TOKEN_EXPIRES_IN = process.env.NEXT_PUBLIC_JWT_EXPIRES_IN || '1d'
		Cookies.set(AUTH.TOKEN, response.data.token, {
			expires: convertToDays(TOKEN_EXPIRES_IN),
			secure: true,
			sameSite: 'strict',
		})
	}

	return response
}

export const refreshToken = async (): Promise<ApiResponse<IRefreshTokenResponse>> => {
	const response = await refreshApi.post<IRefreshTokenResponse>(
		API_URL.AUTH.REFRESH,
		{},
		{ withCredentials: true },
	)
	return response
}

export const logout = async (): Promise<ApiResponse<ILogoutResponse>> => {
	const response = await api.post<ILogoutResponse>(
		API_URL.AUTH.LOGOUT,
		{},
		{ withCredentials: true },
	)
	return response
}
