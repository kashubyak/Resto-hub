import { type INestApplication } from '@nestjs/common'
import { type Order } from '@prisma/client'
import type { Server } from 'http'
import * as request from 'supertest'
import { BASE_URL, type companyData, HOST, logoPath } from './constants'
import { FakeDTO } from './faker'

interface TableResponse {
	id: number
	number: number
	seats: number
	active: boolean
	createdAt: string
	updatedAt: string
	companyId?: number
}

interface CategoryResponse {
	id: number
	name: string
}

interface DishResponse {
	id: number
	name: string
	description: string
	price: number
	imageUrl: string
	categoryId: number | null
	ingredients: string[]
	weightGr: number | null
	calories: number | null
	available: boolean
	companyId: number
	createdAt: string
	updatedAt: string
	category?: {
		id: number
		name: string
	} | null
}

interface UserInfoResponse {
	id: number
	name: string
	email: string
	role: string
	avatarUrl: string | null
	createdAt: string
	updatedAt: string
	companyId?: number
}

export const baseCompanyFormFields = (
	req: request.Test,
	data: typeof companyData,
) => {
	return req
		.field('name', data.name)
		.field('subdomain', data.subdomain)
		.field('address', data.address)
		.field('latitude', data.latitude.toString())
		.field('longitude', data.longitude.toString())
		.field('adminName', data.adminName)
		.field('adminEmail', data.adminEmail)
		.field('adminPassword', data.adminPassword)
}
export const attachCompanyFormFields = (
	req: request.Test,
	data: typeof companyData,
) => {
	return req
		.field('name', data.name)
		.field('subdomain', data.subdomain)
		.field('address', data.address)
		.field('latitude', data.latitude.toString())
		.field('longitude', data.longitude.toString())
		.field('adminName', data.adminName)
		.field('adminEmail', data.adminEmail)
		.field('adminPassword', data.adminPassword)
		.attach('logoUrl', logoPath)
		.attach('avatarUrl', logoPath)
}

export const makeRequest = (
	app: INestApplication,
	token: string,
	method: 'get' | 'post' | 'patch' | 'delete',
	url: string,
) => {
	return request(app.getHttpServer() as Server)
		[method](url)
		.set('Authorization', `Bearer ${token}`)
		.set('Host', HOST)
}

export const createTable = async (
	app: INestApplication,
	token: string,
	dto = FakeDTO.table.create(),
): Promise<TableResponse> => {
	const res = await makeRequest(app, token, 'post', `${BASE_URL.TABLE}/create`)
		.send(dto)
		.expect(201)
	return res.body as TableResponse
}

export const createCategory = async (
	app: INestApplication,
	token: string,
	dto = FakeDTO.category.create(),
): Promise<CategoryResponse> => {
	const res = await makeRequest(
		app,
		token,
		'post',
		`${BASE_URL.CATEGORY}/create`,
	)
		.send(dto)
		.expect(201)
	return res.body as CategoryResponse
}

export const createDish = async (
	app: INestApplication,
	token: string,
	categoryId: number,
	overrideDto: Partial<ReturnType<typeof FakeDTO.dish.create>> = {},
): Promise<DishResponse> => {
	const dto = {
		...FakeDTO.dish.create(),
		categoryId,
		...overrideDto,
	}

	const res = await makeRequest(app, token, 'post', `${BASE_URL.DISH}/create`)
		.field('name', dto.name)
		.field('description', dto.description)
		.field('price', dto.price.toString())
		.field('categoryId', dto.categoryId.toString())
		.field('ingredients', dto.ingredients.join(','))
		.field('weightGr', dto.weightGr.toString())
		.field('calories', dto.calories.toString())
		.field('available', dto.available.toString())
		.attach('imageUrl', logoPath)
		.expect(201)

	return res.body as DishResponse
}

export const getUserInfo = async (
	app: INestApplication,
	token: string,
): Promise<UserInfoResponse> => {
	const res = await makeRequest(
		app,
		token,
		'get',
		`${BASE_URL.USER}/me`,
	).expect(200)
	return res.body as UserInfoResponse
}

export const createOrder = async (
	app: INestApplication,
	token: string,
	categoryId: number,
): Promise<Order> => {
	const dish = await createDish(app, token, categoryId)
	const table = await createTable(app, token)
	const dto = FakeDTO.order.create(dish.id, table.id)

	const response = await makeRequest(
		app,
		token,
		'post',
		`${BASE_URL.ORDER}/create`,
	)
		.send(dto)
		.expect(201)

	return response.body as Order
}
