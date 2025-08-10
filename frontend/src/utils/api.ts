import axios from 'axios'

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	withCredentials: true,
})

api.interceptors.request.use(config => {
	if (typeof window !== 'undefined') {
		const subdomain = localStorage.getItem('subdomain')
		if (subdomain) {
			const apiBase = process.env.NEXT_PUBLIC_API_URL ?? ''
			const base = new URL(apiBase)
			base.hostname = `${subdomain}.localhost`
			config.baseURL = base.toString()
		}
	}

	const accessToken = localStorage.getItem('access_token')
	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`
	}

	return config
})

export default api
