import { type INestApplication } from '@nestjs/common'
import { type Order } from '@prisma/client'
import * as request from 'supertest'
import { BASE_URL, HOST, logoPath } from './constants'
import { FakeDTO } from './faker'

export const baseCompanyFormFields = (
	req: request.Test,
	data: typeof import('./constants').companyData,
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
	data: typeof import('./constants').companyData,
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
	return request(app.getHttpServer())
		[method](url)
		.set('Authorization', `Bearer ${token}`)
		.set('Host', HOST)
}

export const createTable = async (
	app: INestApplication,
	token: string,
	dto = FakeDTO.table.create(),
) => {
	const res = await makeRequest(app, token, 'post', `${BASE_URL.TABLE}/create`)
		.send(dto)
		.expect(201)
	return res.body
}

export const createCategory = async (
	app: INestApplication,
	token: string,
	dto = FakeDTO.category.create(),
) => {
	const res = await makeRequest(
		app,
		token,
		'post',
		`${BASE_URL.CATEGORY}/create`,
	)
		.send(dto)
		.expect(201)
	return res.body
}

export const createDish = async (
	app: INestApplication,
	token: string,
	categoryId: number,
	overrideDto: Partial<ReturnType<typeof FakeDTO.dish.create>> = {},
) => {
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

	return res.body
}

export const getUserInfo = async (app: INestApplication, token: string) => {
	const res = await makeRequest(
		app,
		token,
		'get',
		`${BASE_URL.USER}/me`,
	).expect(200)
	return res.body
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
