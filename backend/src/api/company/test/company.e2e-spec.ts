import { type INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from 'app.module'
import { type Server } from 'http'
import { PrismaService } from 'prisma/prisma.service'
import { CompanyContextMiddleware } from 'src/common/middleware/company-context.middleware'
import * as request from 'supertest'
import { getAuthToken } from 'test/utils/auth-test'
import { BASE_URL, localhost, logoPath } from 'test/utils/constants'
import { cleanTestDb } from 'test/utils/db-utils'
import { makeRequest } from 'test/utils/form-utils'
import { closeTestApp } from 'test/utils/test-cleanup'

interface CompanyResponse {
	id: number
	name: string
	address?: string
	logoUrl?: string
}

describe('Company (e2e)', () => {
	let app: INestApplication
	let prisma: PrismaService
	let token: string
	let companyId: number

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
		await cleanTestDb(prisma)

		const auth = await getAuthToken(app)
		token = auth.token
		companyId = auth.companyId
	})

	afterAll(async () => {
		await closeTestApp(app, prisma)
	})

	it('should get current company info', async () => {
		const res = await makeRequest(app, token, 'get', BASE_URL.COMPANY).expect(
			200,
		)
		const body = res.body as CompanyResponse
		expect(body.id).toBe(companyId)
		expect(body.name).toBeDefined()
	})

	it('should update company info without file', async () => {
		const updateDto = {
			name: 'Updated Company',
			address: 'New Address',
			latitude: 48.0,
			longitude: 24.0,
		}

		const res = await makeRequest(app, token, 'patch', BASE_URL.COMPANY)
			.field('name', updateDto.name)
			.field('address', updateDto.address)
			.field('latitude', updateDto.latitude.toString())
			.field('longitude', updateDto.longitude.toString())
			.expect(200)

		const body = res.body as CompanyResponse
		expect(body.name).toBe(updateDto.name)
		expect(body.address).toBe(updateDto.address)
	})

	it('should update company info with file', async () => {
		const res = await makeRequest(app, token, 'patch', BASE_URL.COMPANY)
			.field('name', 'Company With Logo')
			.attach('logoUrl', logoPath)

			.expect(200)

		const body = res.body as CompanyResponse
		expect(body.name).toBe('Company With Logo')
		expect(body.logoUrl).toBeDefined()
	})

	it('should not update with duplicate name', async () => {
		await prisma.company.create({
			data: {
				name: 'Duplicate Name',
				subdomain: 'dup',
				address: 'Some address',
				latitude: 48.0,
				longitude: 24.0,
				logoUrl: 'https://example.com/logo.png',
			},
		})

		await makeRequest(app, token, 'patch', BASE_URL.COMPANY)
			.field('name', 'Duplicate Name')
			.expect(409)
	})

	it('should delete current company', async () => {
		const res = await makeRequest(
			app,
			token,
			'delete',
			BASE_URL.COMPANY,
		).expect(200)
		const body = res.body as CompanyResponse
		expect(body.id).toBe(companyId)

		const check = await prisma.company.findUnique({ where: { id: companyId } })
		expect(check).toBeNull()
	})

	it('should return 404 on get if company does not exist', async () => {
		await makeRequest(app, token, 'get', BASE_URL.COMPANY).expect(404)
	})

	it('should return 404 on delete if company does not exist', async () => {
		await makeRequest(app, token, 'delete', BASE_URL.COMPANY).expect(404)
	})

	it('should deny access without token', async () => {
		await request(app.getHttpServer() as Server)
			.get(BASE_URL.COMPANY)
			.set('Host', localhost)
			.expect(401)

		await request(app.getHttpServer() as Server)
			.patch(BASE_URL.COMPANY)
			.set('Host', localhost)
			.expect(401)

		await request(app.getHttpServer() as Server)
			.delete(BASE_URL.COMPANY)
			.set('Host', localhost)
			.expect(401)
	})
})
