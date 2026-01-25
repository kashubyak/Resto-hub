import { type INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { OrderStatus } from '@prisma/client'
import { AppModule } from 'app.module'
import { PrismaService } from 'prisma/prisma.service'
import { CompanyContextMiddleware } from 'src/common/middleware/company-context.middleware'
import { getAuthSubUser, getAuthToken } from 'test/utils/auth-test'
import { BASE_URL } from 'test/utils/constants'
import { cleanTestDb } from 'test/utils/db-utils'
import { FakeDTO } from 'test/utils/faker'
import {
	createCategory,
	createDish,
	createTable,
	makeRequest,
} from 'test/utils/form-utils'

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
}

interface TableResponse {
	id: number
	number: number
	seats: number
	active: boolean
	companyId: number
	createdAt: string
	updatedAt: string
}

interface AuthSubUserResponse {
	token: string
	id: number
}

interface OrderItemResponse {
	id: number
	dishId: number
	quantity: number
	price: number
	notes?: string
	orderId: number
}

interface CreateOrderResponse {
	id: number
	waiterId: number
	cookId: number | null
	status: OrderStatus
	tableId: number
	orderItems: OrderItemResponse[]
	createdAt: string
	updatedAt: string
	companyId?: number
}

interface BaseUserResponse {
	id: number
	name: string
}

interface BaseTableResponse {
	id: number
	number: number
}

interface OrderItemSummaryResponse {
	price: number
	quantity: number
	total: number
	notes?: string
	dish: {
		id: number
		name: string
		price: number
	}
}

interface OrderSummaryResponse {
	id: number
	status: OrderStatus
	createdAt: string
	updatedAt: string
	total: number
	waiter?: BaseUserResponse
	cook?: BaseUserResponse | null
	table: BaseTableResponse
	orderItems: OrderItemSummaryResponse[]
}

interface PaginatedOrdersResponse {
	data: OrderSummaryResponse[]
	total: number
	page: number
	limit: number
	totalPages: number
}

interface AssignOrderResponse {
	id: number
	waiterId: number
	cookId: number
	status: OrderStatus
	tableId: number
	createdAt: string
	updatedAt: string
}

interface CancelOrderResponse {
	id: number
	waiterId: number
	cookId: number | null
	status: OrderStatus
	tableId: number
	createdAt: string
	updatedAt: string
}

interface UpdateOrderStatusResponse {
	id: number
	waiterId: number
	cookId: number | null
	status: OrderStatus
	tableId: number
	createdAt: string
	updatedAt: string
}

interface OrderAnalyticsResponse {
	revenue: number
	[key: string]: unknown
}

describe('Order (e2e)', () => {
	let app: INestApplication
	let prisma: PrismaService
	let adminToken: string
	let companyId: number
	let categoryId: number

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile()

		app = moduleRef.createNestApplication()
		app.setGlobalPrefix('api')
		app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

		prisma = moduleRef.get(PrismaService)
		const middleware = new CompanyContextMiddleware(prisma)
		app.use(middleware.use.bind(middleware))

		await app.init()
		await cleanTestDb(prisma)

		const auth = await getAuthToken(app)
		adminToken = auth.token
		companyId = auth.companyId

		const category = (await createCategory(app, adminToken)) as CategoryResponse
		categoryId = category.id
	})
	beforeEach(async () => {
		await prisma.orderItem.deleteMany({})
		await prisma.order.deleteMany({})
		await prisma.dish.deleteMany({ where: { companyId } })
		await prisma.table.deleteMany({ where: { companyId } })
		await prisma.user.deleteMany({
			where: { companyId, role: { not: 'ADMIN' } },
		})
	})

	afterAll(async () => {
		await app.close()
	})

	describe('POST /create', () => {
		it('should create a new order (as WAITER)', async () => {
			const { token: waiterToken, id: waiterId } = (await getAuthSubUser(
				app,
				adminToken,
				FakeDTO.user.waiter(),
			)) as AuthSubUserResponse

			const dish = (await createDish(
				app,
				adminToken,
				categoryId,
			)) as DishResponse
			const table = (await createTable(app, adminToken)) as TableResponse
			const dto = FakeDTO.order.create(dish.id, table.id)

			const res = await makeRequest(
				app,
				waiterToken,
				'post',
				`${BASE_URL.ORDER}/create`,
			)
				.send(dto)
				.expect(201)

			const body = res.body as CreateOrderResponse
			expect(body).toMatchObject({
				waiterId,
				status: 'PENDING',
				companyId,
				tableId: table.id,
			})
			expect(body.orderItems[0]).toMatchObject({
				dishId: dish.id,
				quantity: dto.items[0]?.quantity,
			})
		})

		it('should be forbidden for non-waiter roles', async () => {
			const { token: cookToken } = (await getAuthSubUser(
				app,
				adminToken,
				FakeDTO.user.cook(),
			)) as AuthSubUserResponse
			const dish = (await createDish(
				app,
				adminToken,
				categoryId,
			)) as DishResponse
			const table = (await createTable(app, adminToken)) as TableResponse
			const dto = FakeDTO.order.create(dish.id, table.id)

			await makeRequest(app, cookToken, 'post', `${BASE_URL.ORDER}/create`)
				.send(dto)
				.expect(403)
			await makeRequest(app, adminToken, 'post', `${BASE_URL.ORDER}/create`)
				.send(dto)
				.expect(403)
		})

		it('should fail if table is already occupied', async () => {
			const { token: waiterToken } = (await getAuthSubUser(
				app,
				adminToken,
				FakeDTO.user.waiter(),
			)) as AuthSubUserResponse
			const dish = (await createDish(
				app,
				adminToken,
				categoryId,
			)) as DishResponse
			const table = (await createTable(app, adminToken)) as TableResponse
			const dto = FakeDTO.order.create(dish.id, table.id)

			await makeRequest(app, waiterToken, 'post', `${BASE_URL.ORDER}/create`)
				.send(dto)
				.expect(201)
			await makeRequest(app, waiterToken, 'post', `${BASE_URL.ORDER}/create`)
				.send(dto)
				.expect(409)
		})
	})

	describe('GET Endpoints', () => {
		it('GET /:id - should get a specific order by ID', async () => {
			const { token: waiterToken } = (await getAuthSubUser(
				app,
				adminToken,
				FakeDTO.user.waiter(),
			)) as AuthSubUserResponse
			const dish = (await createDish(
				app,
				adminToken,
				categoryId,
			)) as DishResponse
			const table = (await createTable(app, adminToken)) as TableResponse
			const orderDto = FakeDTO.order.create(dish.id, table.id)
			const createRes = await makeRequest(
				app,
				waiterToken,
				'post',
				`${BASE_URL.ORDER}/create`,
			).send(orderDto)
			const orderId = (createRes.body as CreateOrderResponse).id

			const res = await makeRequest(
				app,
				waiterToken,
				'get',
				`${BASE_URL.ORDER}/${orderId}`,
			).expect(200)
			const body = res.body as OrderSummaryResponse
			expect(body.id).toBe(orderId)
			expect(body.table.id).toBe(table.id)
		})

		it('GET / - should get all orders (as ADMIN)', async () => {
			const { token: waiterToken } = (await getAuthSubUser(
				app,
				adminToken,
				FakeDTO.user.waiter(),
			)) as AuthSubUserResponse
			const dish = (await createDish(
				app,
				adminToken,
				categoryId,
			)) as DishResponse
			const table = (await createTable(app, adminToken)) as TableResponse
			await makeRequest(
				app,
				waiterToken,
				'post',
				`${BASE_URL.ORDER}/create`,
			).send(FakeDTO.order.create(dish.id, table.id))

			const res = await makeRequest(
				app,
				adminToken,
				'get',
				`${BASE_URL.ORDER}`,
			).expect(200)
			const body = res.body as PaginatedOrdersResponse
			expect(body.data.length).toBe(1)
			expect(body.total).toBe(1)
		})

		it('GET /free - should get unassigned orders (as COOK)', async () => {
			const { token: waiterToken } = (await getAuthSubUser(
				app,
				adminToken,
				FakeDTO.user.waiter(),
			)) as AuthSubUserResponse
			const { token: cookToken } = (await getAuthSubUser(
				app,
				adminToken,
				FakeDTO.user.cook(),
			)) as AuthSubUserResponse
			const dish = (await createDish(
				app,
				adminToken,
				categoryId,
			)) as DishResponse
			const table = (await createTable(app, adminToken)) as TableResponse
			await makeRequest(
				app,
				waiterToken,
				'post',
				`${BASE_URL.ORDER}/create`,
			).send(FakeDTO.order.create(dish.id, table.id))

			const res = await makeRequest(
				app,
				cookToken,
				'get',
				`${BASE_URL.ORDER}/free`,
			).expect(200)
			const body = res.body as PaginatedOrdersResponse
			expect(body.data.length).toBe(1)
			expect(body.data[0]?.cook).toBeNull()
		})
	})

	describe('PATCH State Changes', () => {
		it('PATCH /:id/assign - should assign an order to a cook', async () => {
			const { token: waiterToken } = (await getAuthSubUser(
				app,
				adminToken,
				FakeDTO.user.waiter(),
			)) as AuthSubUserResponse
			const { token: cookToken, id: cookId } = (await getAuthSubUser(
				app,
				adminToken,
				FakeDTO.user.cook(),
			)) as AuthSubUserResponse
			const dish = (await createDish(
				app,
				adminToken,
				categoryId,
			)) as DishResponse
			const table = (await createTable(app, adminToken)) as TableResponse
			const createRes = await makeRequest(
				app,
				waiterToken,
				'post',
				`${BASE_URL.ORDER}/create`,
			).send(FakeDTO.order.create(dish.id, table.id))
			const orderId = (createRes.body as CreateOrderResponse).id

			const res = await makeRequest(
				app,
				cookToken,
				'patch',
				`${BASE_URL.ORDER}/${orderId}/assign`,
			).expect(200)
			const body = res.body as AssignOrderResponse
			expect(body.cookId).toBe(cookId)
			expect(body.status).toBe(OrderStatus.IN_PROGRESS)
		})

		it('PATCH /:id/cancel - should cancel an order (as WAITER)', async () => {
			const { token: waiterToken } = (await getAuthSubUser(
				app,
				adminToken,
				FakeDTO.user.waiter(),
			)) as AuthSubUserResponse
			const dish = (await createDish(
				app,
				adminToken,
				categoryId,
			)) as DishResponse
			const table = (await createTable(app, adminToken)) as TableResponse
			const createRes = await makeRequest(
				app,
				waiterToken,
				'post',
				`${BASE_URL.ORDER}/create`,
			).send(FakeDTO.order.create(dish.id, table.id))
			const orderId = (createRes.body as CreateOrderResponse).id

			const res = await makeRequest(
				app,
				waiterToken,
				'patch',
				`${BASE_URL.ORDER}/${orderId}/cancel`,
			).expect(200)
			const body = res.body as CancelOrderResponse
			expect(body.status).toBe(OrderStatus.CANCELED)
		})

		it('PATCH /:id/status - should be updated by COOK to COMPLETE', async () => {
			const { token: waiterToken } = (await getAuthSubUser(
				app,
				adminToken,
				FakeDTO.user.waiter(),
			)) as AuthSubUserResponse
			const { token: cookToken } = (await getAuthSubUser(
				app,
				adminToken,
				FakeDTO.user.cook(),
			)) as AuthSubUserResponse
			const dish = (await createDish(
				app,
				adminToken,
				categoryId,
			)) as DishResponse
			const table = (await createTable(app, adminToken)) as TableResponse
			const createRes = await makeRequest(
				app,
				waiterToken,
				'post',
				`${BASE_URL.ORDER}/create`,
			).send(FakeDTO.order.create(dish.id, table.id))
			const orderId = (createRes.body as CreateOrderResponse).id

			await makeRequest(
				app,
				cookToken,
				'patch',
				`${BASE_URL.ORDER}/${orderId}/assign`,
			)

			const res = await makeRequest(
				app,
				cookToken,
				'patch',
				`${BASE_URL.ORDER}/${orderId}/status`,
			)
				.send({ status: OrderStatus.COMPLETE })
				.expect(200)
			const body = res.body as UpdateOrderStatusResponse
			expect(body.status).toBe(OrderStatus.COMPLETE)
		})

		it('PATCH /:id/status - should be updated by WAITER to DELIVERED and FINISHED', async () => {
			const { token: waiterToken } = (await getAuthSubUser(
				app,
				adminToken,
				FakeDTO.user.waiter(),
			)) as AuthSubUserResponse
			const { token: cookToken } = (await getAuthSubUser(
				app,
				adminToken,
				FakeDTO.user.cook(),
			)) as AuthSubUserResponse
			const dish = (await createDish(
				app,
				adminToken,
				categoryId,
			)) as DishResponse
			const table = (await createTable(app, adminToken)) as TableResponse
			const createRes = await makeRequest(
				app,
				waiterToken,
				'post',
				`${BASE_URL.ORDER}/create`,
			).send(FakeDTO.order.create(dish.id, table.id))
			const orderId = (createRes.body as CreateOrderResponse).id

			await makeRequest(
				app,
				cookToken,
				'patch',
				`${BASE_URL.ORDER}/${orderId}/assign`,
			)
			await makeRequest(
				app,
				cookToken,
				'patch',
				`${BASE_URL.ORDER}/${orderId}/status`,
			).send({ status: OrderStatus.COMPLETE })

			await makeRequest(
				app,
				waiterToken,
				'patch',
				`${BASE_URL.ORDER}/${orderId}/status`,
			)
				.send({ status: OrderStatus.DELIVERED })
				.expect(200)

			await makeRequest(
				app,
				waiterToken,
				'patch',
				`${BASE_URL.ORDER}/${orderId}/status`,
			)
				.send({ status: OrderStatus.FINISHED })
				.expect(200)

			const updatedTable = await prisma.table.findUnique({
				where: { id: table.id },
			})
			expect(updatedTable?.active).toBe(true)
		})
	})

	describe('GET /analytics', () => {
		it('should get order analytics (as ADMIN)', async () => {
			const { token: waiterToken } = (await getAuthSubUser(
				app,
				adminToken,
				FakeDTO.user.waiter(),
			)) as AuthSubUserResponse
			const dish = (await createDish(
				app,
				adminToken,
				categoryId,
			)) as DishResponse
			const table = (await createTable(app, adminToken)) as TableResponse
			await makeRequest(
				app,
				waiterToken,
				'post',
				`${BASE_URL.ORDER}/create`,
			).send(FakeDTO.order.create(dish.id, table.id))

			const res = await makeRequest(
				app,
				adminToken,
				'get',
				`${BASE_URL.ORDER}/analytics`,
			).expect(200)
			const body = res.body as OrderAnalyticsResponse[]
			expect(Array.isArray(body)).toBe(true)
			expect(body[0]).toHaveProperty('revenue')
		})
	})
})
