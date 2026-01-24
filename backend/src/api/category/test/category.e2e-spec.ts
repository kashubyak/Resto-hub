import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from 'app.module'
import { PrismaService } from 'prisma/prisma.service'
import { CompanyContextMiddleware } from 'src/common/middleware/company-context.middleware'
import * as request from 'supertest'
import { getAuthToken } from 'test/utils/auth-test'
import { BASE_URL, HOST } from 'test/utils/constants'
import { cleanTestDb } from 'test/utils/db-utils'
import { FakeDTO } from 'test/utils/faker'
import { createCategory, makeRequest } from 'test/utils/form-utils'

describe('Category (e2e)', () => {
	let app: INestApplication
	let prisma: PrismaService
	let token: string
	let companyId: number
	let categoryId: number

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile()

		app = moduleRef.createNestApplication()
		app.setGlobalPrefix('api')
		app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

		prisma = moduleRef.get(PrismaService)
		const middleware = new CompanyContextMiddleware(prisma)
		app.use(middleware.use.bind(middleware))

		await app.init()
		prisma = app.get(PrismaService)
		await cleanTestDb(prisma)

		const auth = await getAuthToken(app)
		token = auth.token
		companyId = auth.companyId
	})

	beforeEach(async () => {
		await prisma.category.deleteMany({ where: { companyId } })
		const category = await createCategory(app, token)
		categoryId = category.id
	})

	afterAll(async () => {
		await app.close()
	})

	it('should create a category', async () => {
		const dto = FakeDTO.category.create()
		const res = await makeRequest(
			app,
			token,
			'post',
			`${BASE_URL.CATEGORY}/create`,
		)
			.send(dto)
			.expect(201)
		expect(res.body.name).toBe(dto.name)
	})

	it('should not allow duplicate category names', async () => {
		const existing = await prisma.category.findFirst({ where: { companyId } })
		await makeRequest(app, token, 'post', `${BASE_URL.CATEGORY}/create`)
			.send({ name: existing!.name })
			.expect(409)
	})

	it('should return paginated categories', async () => {
		await createCategory(app, token, FakeDTO.category.create())
		const res = await makeRequest(
			app,
			token,
			'get',
			`${BASE_URL.CATEGORY}?page=1&limit=10`,
		).expect(200)
		expect(Array.isArray(res.body.data)).toBe(true)
		expect(res.body.total).toBeGreaterThanOrEqual(1)
	})

	it('should filter by search', async () => {
		const dto = { name: 'UniqueCategoryName' }
		await createCategory(app, token, dto)
		const res = await makeRequest(
			app,
			token,
			'get',
			`${BASE_URL.CATEGORY}?search=UniqueCategoryName`,
		).expect(200)

		expect(Array.isArray(res.body.data)).toBe(true)
		expect(res.body.data.length).toBeGreaterThan(0)
		expect(res.body.data[0].name).toBe(dto.name)
	})

	it('should sort categories by name ascending', async () => {
		await createCategory(app, token, { name: 'Alpha' })
		await createCategory(app, token, { name: 'Beta' })
		const res = await makeRequest(
			app,
			token,
			'get',
			`${BASE_URL.CATEGORY}?sortBy=name&order=asc`,
		).expect(200)
		const names = res.body.data.map((c: any) => c.name)
		expect(names).toEqual([...names].sort())
	})

	it('should fallback to default pagination if page/limit are missing', async () => {
		await createCategory(app, token, { name: 'ExtraCategory' })
		const res = await makeRequest(
			app,
			token,
			'get',
			`${BASE_URL.CATEGORY}`,
		).expect(200)
		expect(res.body.page).toBe(1)
		expect(res.body.limit).toBe(10)
	})

	it('should return 404 when updating non-existent category', async () => {
		await makeRequest(app, token, 'patch', `${BASE_URL.CATEGORY}/9999999`)
			.send({ name: 'Updated' })
			.expect(404)
	})

	it('should return deleted category in response', async () => {
		const cat = await createCategory(app, token, { name: 'ToBeDeleted' })
		const res = await makeRequest(
			app,
			token,
			'delete',
			`${BASE_URL.CATEGORY}/${cat.id}`,
		).expect(200)
		expect(res.body.id).toBe(cat.id)
		expect(res.body.name).toBe(cat.name)
	})

	it('should get category by id', async () => {
		const res = await makeRequest(
			app,
			token,
			'get',
			`${BASE_URL.CATEGORY}/${categoryId}`,
		).expect(200)
		expect(res.body.id).toBe(categoryId)
	})

	it('should return 404 if category not found by id', async () => {
		await makeRequest(app, token, 'get', `${BASE_URL.CATEGORY}/9999999`).expect(
			404,
		)
	})

	it('should update category', async () => {
		const dto = { name: 'UpdatedCategoryName' }
		const res = await makeRequest(
			app,
			token,
			'patch',
			`${BASE_URL.CATEGORY}/${categoryId}`,
		)
			.send(dto)
			.expect(200)
		expect(res.body.name).toBe(dto.name)
	})

	it('should not allow updating to duplicate name', async () => {
		const cat1 = await createCategory(app, token, { name: 'Cat1' })
		const cat2 = await createCategory(app, token, { name: 'Cat2' })
		await makeRequest(app, token, 'patch', `${BASE_URL.CATEGORY}/${cat1.id}`)
			.send({ name: cat2.name })
			.expect(409)
	})

	it('should delete category', async () => {
		const cat = await createCategory(app, token)
		await makeRequest(
			app,
			token,
			'delete',
			`${BASE_URL.CATEGORY}/${cat.id}`,
		).expect(200)
		await makeRequest(
			app,
			token,
			'get',
			`${BASE_URL.CATEGORY}/${cat.id}`,
		).expect(404)
	})

	it('should return 404 when deleting non-existent category', async () => {
		await makeRequest(app, token, 'delete', `${BASE_URL.CATEGORY}/9999999`)
			.expect(404)
			.expect(404)
	})

	it('should block access without token', async () => {
		await request(app.getHttpServer())
			.get(BASE_URL.CATEGORY)
			.set('Host', HOST)
			.expect(401)

		await request(app.getHttpServer())
			.post(`${BASE_URL.CATEGORY}/create`)
			.set('Host', HOST)
			.send(FakeDTO.category.create())
			.expect(401)

		await request(app.getHttpServer())
			.patch(`${BASE_URL.CATEGORY}/1`)
			.set('Host', HOST)
			.send({ name: 'New' })
			.expect(401)

		await request(app.getHttpServer())
			.delete(`${BASE_URL.CATEGORY}/1`)
			.set('Host', HOST)
			.expect(401)
	})
})
