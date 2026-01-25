import { type INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, type TestingModule } from '@nestjs/testing'
import { type Role } from '@prisma/client'
import { AppModule } from 'app.module'
import * as cookieParser from 'cookie-parser'
import type { Server } from 'http'
import { PrismaService } from 'prisma/prisma.service'
import { CompanyContextMiddleware } from 'src/common/middleware/company-context.middleware'
import { S3Service } from 'src/common/s3/s3.service'
import * as request from 'supertest'
import { getAuthToken } from 'test/utils/auth-test'
import { BASE_URL, companyData, HOST, logoPath } from 'test/utils/constants'
import { cleanTestDb } from 'test/utils/db-utils'
import { makeRequest } from 'test/utils/form-utils'

interface UserItemResponse {
	id: number
	name: string
	email: string
	role: Role
	avatarUrl: string
	createdAt: string
	updatedAt: string
	companyId?: number
}

interface PaginatedUserResponse {
	data: UserItemResponse[]
	total: number
	page: number
	limit: number
	totalPages: number
}

describe('User (e2e)', () => {
	let app: INestApplication
	let server: Server
	let prisma: PrismaService
	let s3Service: S3Service
	let token: string
	let companyId: number

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile()

		app = moduleFixture.createNestApplication()
		app.setGlobalPrefix('api')
		app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
		app.use(cookieParser())

		prisma = app.get(PrismaService)
		s3Service = app.get(S3Service)

		const middleware = new CompanyContextMiddleware(prisma)
		app.use(middleware.use.bind(middleware))
		await app.init()
		server = app.getHttpServer() as Server

		await cleanTestDb(prisma)
		const auth = await getAuthToken(app)
		token = auth.token
		companyId = auth.companyId
	})

	afterAll(async () => {
		await s3Service.deleteFolder('avatars')
		await app.close()
	})

	describe(`${BASE_URL.USER}/register (POST)`, () => {
		it('should register a COOK user', async () => {
			const dto = {
				name: 'Cook User',
				email: 'cook@example.com',
				password: 'password123',
				role: 'COOK',
			}

			const res = await makeRequest(
				app,
				token,
				'post',
				`${BASE_URL.USER}/register`,
			)
				.field('name', dto.name)
				.field('email', dto.email)
				.field('password', dto.password)
				.field('role', dto.role)
				.attach('avatarUrl', logoPath)
				.expect(201)

			const body = res.body as UserItemResponse
			expect(body).toHaveProperty('id')
			expect(body.email).toBe(dto.email)

			const userInDb = await prisma.user.findFirst({
				where: { email: dto.email, companyId },
			})
			expect(userInDb).toBeTruthy()
		})

		it('should not allow ADMIN role', async () => {
			await makeRequest(app, token, 'post', `${BASE_URL.USER}/register`)
				.field('name', 'Admin Imposter')
				.field('email', 'admin2@example.com')
				.field('password', 'password123')
				.field('role', 'ADMIN')
				.attach('avatarUrl', logoPath)
				.expect(400)
		})

		it('should not allow missing avatar', async () => {
			await makeRequest(app, token, 'post', `${BASE_URL.USER}/register`)
				.field('name', 'Cook No Avatar')
				.field('email', 'cook-no-avatar@example.com')
				.field('password', 'password123')
				.field('role', 'COOK')
				.expect(400)
		})
	})

	describe(`${BASE_URL.USER} (GET)`, () => {
		it('should return paginated users for company', async () => {
			const res = await makeRequest(
				app,
				token,
				'get',
				`${BASE_URL.USER}`,
			).expect(200)
			const body = res.body as PaginatedUserResponse
			expect(body.data).toBeInstanceOf(Array)
			expect(body).toHaveProperty('total')
			expect(
				body.data.every((u: UserItemResponse) => u.companyId === companyId),
			).toBe(true)
		})

		it('should filter users by role', async () => {
			const res = await makeRequest(
				app,
				token,
				'get',
				`${BASE_URL.USER}?role=COOK`,
			).expect(200)
			const body = res.body as PaginatedUserResponse
			expect(body.data.every((u: UserItemResponse) => u.role === 'COOK')).toBe(
				true,
			)
		})
	})

	describe(`${BASE_URL.USER}/me (GET/PATCH)`, () => {
		it('should return current user', async () => {
			const res = await makeRequest(
				app,
				token,
				'get',
				`${BASE_URL.USER}/me`,
			).expect(200)
			const body = res.body as UserItemResponse
			expect(body.email).toBe(companyData.adminEmail)
		})

		it('should update current user profile (name + avatar)', async () => {
			const res = await makeRequest(app, token, 'patch', `${BASE_URL.USER}/me`)
				.field('name', 'Updated Name')
				.attach('avatarUrl', logoPath)
				.expect(200)
			const body = res.body as UserItemResponse
			expect(body.name).toBe('Updated Name')
		})

		it('should change password with oldPassword', async () => {
			await makeRequest(app, token, 'patch', `${BASE_URL.USER}/me`)
				.field('oldPassword', companyData.adminPassword)
				.field('password', 'newpassword123')
				.expect(200)
		})

		it('should fail if oldPassword is wrong', async () => {
			await makeRequest(app, token, 'patch', `${BASE_URL.USER}/me`)
				.field('oldPassword', 'wrongpass')
				.field('password', 'whatever123')
				.expect(400)
		})
	})

	describe(`${BASE_URL.USER}/:id (GET/PATCH/DELETE)`, () => {
		let userId: number

		beforeAll(async () => {
			const res = await makeRequest(
				app,
				token,
				'post',
				`${BASE_URL.USER}/register`,
			)
				.field('name', 'UserForUpdate')
				.field('email', 'updateuser@example.com')
				.field('password', 'password123')
				.field('role', 'WAITER')
				.attach('avatarUrl', logoPath)
				.expect(201)

			const body = res.body as UserItemResponse
			userId = body.id
		})

		it('should get user by id', async () => {
			const res = await makeRequest(
				app,
				token,
				'get',
				`${BASE_URL.USER}/${userId}`,
			).expect(200)
			const body = res.body as UserItemResponse
			expect(body.id).toBe(userId)
		})

		it('should update user by id', async () => {
			const res = await makeRequest(
				app,
				token,
				'patch',
				`${BASE_URL.USER}/${userId}`,
			)
				.field('name', 'New Name')
				.attach('avatarUrl', logoPath)
				.expect(200)

			const body = res.body as UserItemResponse
			expect(body.name).toBe('New Name')
		})

		it('should delete user', async () => {
			await makeRequest(
				app,
				token,
				'delete',
				`${BASE_URL.USER}/${userId}`,
			).expect(200)
			await makeRequest(app, token, 'get', `${BASE_URL.USER}/${userId}`).expect(
				404,
			)
		})

		it('should return 404 when user not found', async () => {
			await makeRequest(app, token, 'get', `${BASE_URL.USER}/99999`).expect(404)
		})
	})

	describe('Access control (unauthorized)', () => {
		it('should deny access without token', async () => {
			await request(server)
				.get(`${BASE_URL.USER}`)
				.set('Host', HOST)
				.expect(401)
			await request(server)
				.get(`${BASE_URL.USER}/me`)
				.set('Host', HOST)
				.expect(401)
			await request(server)
				.post(`${BASE_URL.USER}/register`)
				.set('Host', HOST)
				.field('name', 'Fake')
				.field('email', 'fake@example.com')
				.field('password', '123456')
				.field('role', 'COOK')
				.attach('avatarUrl', logoPath)
				.expect(401)
			await request(server)
				.patch(`${BASE_URL.USER}/me`)
				.set('Host', HOST)
				.field('name', 'ShouldNotWork')
				.expect(401)
		})
	})
})
