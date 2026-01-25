import * as path from 'path'

export const BASE_URL = {
	TABLE: '/api/table',
	CATEGORY: '/api/category',
	AUTH: '/api/auth',
	COMPANY: '/api/company',
	USER: '/api/user',
	DISH: '/api/dish',
	ORDER: '/api/order',
}
export const HOST = 'testcompany.localhost'
export const logoPath = path.resolve(__dirname, '../assets/logo.jpg')
export const localhost = 'localhost'

export const companyData = {
	name: 'TestCompany',
	subdomain: 'testcompany',
	address: '123 Main St',
	latitude: 50.45,
	longitude: 30.5234,
	adminName: 'Test Admin',
	adminEmail: 'admin@example.com',
	adminPassword: 'password123',
}

export const CONNECTION_POOL_RELEASE_DELAY = 500
