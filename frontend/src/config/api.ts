const WS = process.env.NEXT_PUBLIC_WEBSOCKET_URL
const AUTH_BASE = process.env.NEXT_PUBLIC_AUTH || '/auth'
const CATEGORY_BASE = process.env.NEXT_PUBLIC_CATEGORY
const DISH_BASE = process.env.NEXT_PUBLIC_DISH
const BASE_ORDER = process.env.NEXT_PUBLIC_ORDER
const TABLE_BASE = process.env.NEXT_PUBLIC_TABLE
const USER_BASE = process.env.NEXT_PUBLIC_USER
const COMPANY_BASE = process.env.NEXT_PUBLIC_COMPANY
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

export const API_URL = {
	BASE_SOCKET: WS,
	GOOGLE_MAPS: GOOGLE_MAPS_API_KEY,

	AUTH: {
		ROOT: AUTH_BASE,
		REGISTER: `${AUTH_BASE}/register-company`,
		LOGIN: `${AUTH_BASE}/login`,
		REFRESH: `${AUTH_BASE}/refresh`,
		LOGOUT: `${AUTH_BASE}/logout`,
	},

	CATEGORY: {
		ROOT: CATEGORY_BASE,
		CREATE: `${CATEGORY_BASE}/create`,
		ID: (id: number) => `${CATEGORY_BASE}/${id}`,
	},

	DISH: {
		ROOT: DISH_BASE,
		CREATE: `${DISH_BASE}/create`,
		ID: (id: number) => `${DISH_BASE}/${id}`,
		REMOVE_CATEGORY: (id: number) => `${DISH_BASE}/${id}/remove-category`,
		ASSIGN_CATEGORY: (id: number, categoryId: number) =>
			`${DISH_BASE}/${id}/assign-category/${categoryId}`,
	},

	ORDER: {
		ROOT: BASE_ORDER,
		CREATE: `${BASE_ORDER}/create`,
		ANALYTICS: `${BASE_ORDER}/analytics`,
		HISTORY: `${BASE_ORDER}/history`,
		FREE: `${BASE_ORDER}/free`,
		ID: (id: number) => `${BASE_ORDER}/${id}`,
		ASSIGN: (id: number) => `${BASE_ORDER}/${id}/assign`,
		CANCEL: (id: number) => `${BASE_ORDER}/${id}/cancel`,
		STATUS: (id: number) => `${BASE_ORDER}/${id}/status`,
	},

	TABLE: {
		ROOT: TABLE_BASE,
		CREATE: `${TABLE_BASE}/create`,
		ID: (id: number) => `${TABLE_BASE}/${id}`,
	},

	USER: {
		ROOT: USER_BASE,
		REGISTER: `${USER_BASE}/register`,
		ME: `${USER_BASE}/me`,
		ID: (id: number) => `${USER_BASE}/${id}`,
	},

	COMPANY: {
		ROOT: COMPANY_BASE,
	},
}
