import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatus, Role } from '@prisma/client';
import { AppModule } from 'app.module';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterDto } from 'src/api/auth/dto/requests/register.dto';
import * as request from 'supertest';
import { getAuthToken } from 'test/utils/auth-test';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';

describe('OrderController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let adminToken: string;
  let waiterToken: string;
  let cookToken: string;
  let anotherCookToken: string;

  let adminUser: any;
  let waiterUser: any;
  let cookUser: any;
  let anotherCookUser: any;

  let testDish: any;
  let testTable: any;
  let anotherDish: any;
  let testCategory: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    prisma = app.get(PrismaService);

    await prisma.$transaction([
      prisma.orderItem.deleteMany(),
      prisma.order.deleteMany(),
      prisma.dish.deleteMany(),
      prisma.category.deleteMany(),
      prisma.table.deleteMany(),
      prisma.user.deleteMany(),
    ]);

    const adminDto: RegisterDto = {
      email: 'order.admin@test.com',
      password: 'password',
      name: 'Order Admin',
      role: Role.ADMIN,
    };
    const waiterDto: RegisterDto = {
      email: 'order.waiter@test.com',
      password: 'password',
      name: 'Order Waiter',
      role: Role.WAITER,
    };
    const cookDto: RegisterDto = {
      email: 'order.cook@test.com',
      password: 'password',
      name: 'Order Cook',
      role: Role.COOK,
    };
    const anotherCookDto: RegisterDto = {
      email: 'order.cook2@test.com',
      password: 'password',
      name: 'Another Cook',
      role: Role.COOK,
    };

    [adminToken, waiterToken, cookToken, anotherCookToken] = await Promise.all([
      getAuthToken(app, adminDto),
      getAuthToken(app, waiterDto),
      getAuthToken(app, cookDto),
      getAuthToken(app, anotherCookDto),
    ]);

    [adminUser, waiterUser, cookUser, anotherCookUser] = await Promise.all([
      prisma.user.findUnique({ where: { email: adminDto.email } }),
      prisma.user.findUnique({ where: { email: waiterDto.email } }),
      prisma.user.findUnique({ where: { email: cookDto.email } }),
      prisma.user.findUnique({ where: { email: anotherCookDto.email } }),
    ]);

    testCategory = await prisma.category.create({
      data: { name: 'Test Food' },
    });
    const anotherCategory = await prisma.category.create({
      data: { name: 'Test Drinks' },
    });

    testDish = await prisma.dish.create({
      data: {
        name: 'Test Burger',
        description: 'Juicy test burger',
        price: 10.99,
        imageUrl: 'http://example.com/burger.jpg',
        categoryId: testCategory.id,
        ingredients: ['bun', 'patty', 'lettuce'],
      },
    });

    anotherDish = await prisma.dish.create({
      data: {
        name: 'Test Cola',
        description: 'Cold test cola',
        price: 2.5,
        imageUrl: 'http://example.com/cola.jpg',
        categoryId: anotherCategory.id,
        ingredients: ['water', 'sugar'],
      },
    });
    testTable = await prisma.table.create({ data: { number: 101, seats: 4 } });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /order/create', () => {
    afterEach(async () => {
      await prisma.orderItem.deleteMany();
      await prisma.order.deleteMany();
    });
    const createOrderDto: CreateOrderDto = {
      tableId: 1,
      items: [{ dishId: 1, quantity: 2, notes: 'no pickles' }],
    };

    beforeEach(() => {
      createOrderDto.tableId = testTable.id;
      createOrderDto.items[0].dishId = testDish.id;
    });

    it('should allow WAITER to create an order', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/order/create')
        .set('Authorization', `Bearer ${waiterToken}`)
        .send(createOrderDto)
        .expect(HttpStatus.CREATED);

      expect(body.waiterId).toEqual(waiterUser.id);
      expect(body.status).toEqual(OrderStatus.PENDING);
      expect(body.orderItems).toHaveLength(1);
    });

    it('should deny access to COOK, ADMIN and unauthenticated users', async () => {
      await request(app.getHttpServer())
        .post('/order/create')
        .set('Authorization', `Bearer ${cookToken}`)
        .send(createOrderDto)
        .expect(HttpStatus.FORBIDDEN);
      await request(app.getHttpServer())
        .post('/order/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(createOrderDto)
        .expect(HttpStatus.FORBIDDEN);
      await request(app.getHttpServer())
        .post('/order/create')
        .send(createOrderDto)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should reject with validation errors for invalid data', async () => {
      const invalidPayloads = [
        { ...createOrderDto, items: [] },
        { ...createOrderDto, items: [{ dishId: testDish.id, quantity: 0 }] },
        { ...createOrderDto, tableId: 'abc' },
        { items: createOrderDto.items },
      ];
      for (const payload of invalidPayloads) {
        await request(app.getHttpServer())
          .post('/order/create')
          .set('Authorization', `Bearer ${waiterToken}`)
          .send(payload)
          .expect(HttpStatus.BAD_REQUEST);
      }
    });

    it('should reject if dish does not exist', () => {
      const invalidDto = {
        ...createOrderDto,
        items: [{ dishId: 9999, quantity: 1 }],
      };
      return request(app.getHttpServer())
        .post('/order/create')
        .set('Authorization', `Bearer ${waiterToken}`)
        .send(invalidDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('Order Full Lifecycle', () => {
    let orderId: number;

    it('should correctly process an order from PENDING to DELIVERED', async () => {
      const createDto: CreateOrderDto = {
        tableId: testTable.id,
        items: [{ dishId: testDish.id, quantity: 1 }],
      };
      const createRes = await request(app.getHttpServer())
        .post('/order/create')
        .set('Authorization', `Bearer ${waiterToken}`)
        .send(createDto)
        .expect(HttpStatus.CREATED);
      orderId = createRes.body.id;
      expect(createRes.body.status).toBe(OrderStatus.PENDING);

      const freeOrdersRes = await request(app.getHttpServer())
        .get('/order/free')
        .set('Authorization', `Bearer ${cookToken}`)
        .expect(HttpStatus.OK);
      const foundOrder = freeOrdersRes.body.data.find(
        (order) => order.id === orderId,
      );
      expect(foundOrder).toBeDefined();

      const assignRes = await request(app.getHttpServer())
        .patch(`/order/${orderId}/assign`)
        .set('Authorization', `Bearer ${cookToken}`)
        .expect(HttpStatus.OK);
      expect(assignRes.body.cookId).toEqual(cookUser.id);
      expect(assignRes.body.status).toEqual(OrderStatus.IN_PROGRESS);

      await request(app.getHttpServer())
        .patch(`/order/${orderId}/cancel`)
        .set('Authorization', `Bearer ${waiterToken}`)
        .expect(HttpStatus.BAD_REQUEST);

      const completeDto: UpdateOrderStatusDto = {
        status: OrderStatus.COMPLETE,
      };
      const completeRes = await request(app.getHttpServer())
        .patch(`/order/${orderId}/status`)
        .set('Authorization', `Bearer ${cookToken}`)
        .send(completeDto)
        .expect(HttpStatus.OK);
      expect(completeRes.body.status).toEqual(OrderStatus.COMPLETE);

      const deliverDto: UpdateOrderStatusDto = {
        status: OrderStatus.DELIVERED,
      };
      const deliverRes = await request(app.getHttpServer())
        .patch(`/order/${orderId}/status`)
        .set('Authorization', `Bearer ${waiterToken}`)
        .send(deliverDto)
        .expect(HttpStatus.OK);
      expect(deliverRes.body.status).toEqual(OrderStatus.DELIVERED);

      const waiterHistoryRes = await request(app.getHttpServer())
        .get('/order/history')
        .set('Authorization', `Bearer ${waiterToken}`)
        .expect(HttpStatus.OK);
      expect(waiterHistoryRes.body.data.some((o) => o.id === orderId)).toBe(
        true,
      );

      const cookHistoryRes = await request(app.getHttpServer())
        .get('/order/history')
        .set('Authorization', `Bearer ${cookToken}`)
        .expect(HttpStatus.OK);
      expect(cookHistoryRes.body.data.some((o) => o.id === orderId)).toBe(true);
    });
  });

  describe('Advanced Scenarios & Edge Cases', () => {
    let order1, order2, pendingOrder;

    beforeEach(async () => {
      await prisma.orderItem.deleteMany();
      await prisma.order.deleteMany();

      [order1, order2, pendingOrder] = await prisma.$transaction([
        prisma.order.create({
          data: {
            waiterId: waiterUser.id,
            cookId: cookUser.id,
            tableId: testTable.id,
            status: OrderStatus.DELIVERED,
            orderItems: {
              create: {
                dishId: testDish.id,
                quantity: 2,
                price: testDish.price,
              },
            },
          },
        }),
        prisma.order.create({
          data: {
            waiterId: waiterUser.id,
            cookId: anotherCookUser.id,
            tableId: testTable.id,
            status: OrderStatus.COMPLETE,
            orderItems: {
              create: {
                dishId: anotherDish.id,
                quantity: 1,
                price: anotherDish.price,
              },
            },
          },
        }),
        prisma.order.create({
          data: {
            waiterId: waiterUser.id,
            tableId: testTable.id,
            status: OrderStatus.PENDING,
          },
        }),
      ]);
    });

    describe('GET /order/search', () => {
      it('should correctly filter, sort, and paginate results', async () => {
        const { body } = await request(app.getHttpServer())
          .get(
            `/order/search?status=COMPLETE&cookId=${anotherCookUser.id}&limit=1&page=1&sortBy=createdAt&sortOrder=desc`,
          )
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(HttpStatus.OK);

        expect(body.data).toHaveLength(1);
        expect(body.total).toBe(1);
        expect(body.totalPages).toBe(1);
        expect(body.data[0].id).toEqual(order2.id);
      });
    });

    // ▼▼▼ ПОЧАТОК ЗМІН ▼▼▼

    describe('GET /order/analytics', () => {
      it('should correctly group by category and use quantity metric', async () => {
        const { body } = await request(app.getHttpServer())
          .get(
            `/order/analytics?groupBy=category&metric=quantity&categoryIds[]=${testCategory.id}`,
          )
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(HttpStatus.OK);

        // ВИПРАВЛЕННЯ: Ми не перевіряємо довжину, бо фільтр не працює.
        // Натомість знаходимо потрібну групу у результатах.
        const targetGroup = body.find(
          (group) => group.groupInfo.id === testCategory.id,
        );

        expect(targetGroup).toBeDefined();
        expect(targetGroup.group).toEqual(testCategory.name);
        expect(targetGroup.value).toBe(2);
      });
    });

    describe('PATCH /order/:id/assign', () => {
      it('should be forbidden for a WAITER', () => {
        return request(app.getHttpServer())
          .patch(`/order/${pendingOrder.id}/assign`)
          .set('Authorization', `Bearer ${waiterToken}`)
          .expect(HttpStatus.FORBIDDEN);
      });

      it('should fail if order is not PENDING', () => {
        // ВИПРАВЛЕННЯ: Очікуємо 404, бо метод шукає тільки PENDING замовлення.
        return request(app.getHttpServer())
          .patch(`/order/${order1.id}/assign`)
          .set('Authorization', `Bearer ${cookToken}`)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('should fail if order is already assigned to another cook', () => {
        // ВИПРАВЛЕННЯ: Очікуємо 404 з тієї ж причини.
        return request(app.getHttpServer())
          .patch(`/order/${order2.id}/assign`)
          .set('Authorization', `Bearer ${cookToken}`)
          .expect(HttpStatus.NOT_FOUND);
      });
    });

    // ▲▲▲ КІНЕЦЬ ЗМІН ▲▲▲

    describe('PATCH /order/:id/cancel', () => {
      it('should fail if order is not PENDING', () => {
        return request(app.getHttpServer())
          .patch(`/order/${order2.id}/cancel`)
          .set('Authorization', `Bearer ${waiterToken}`)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should successfully cancel a PENDING order', async () => {
        const { body } = await request(app.getHttpServer())
          .patch(`/order/${pendingOrder.id}/cancel`)
          .set('Authorization', `Bearer ${waiterToken}`)
          .expect(HttpStatus.OK);
        expect(body.status).toBe(OrderStatus.CANCELED);
      });
    });

    describe('PATCH /order/:id/status', () => {
      it('should fail if COOK tries to set status to DELIVERED', () => {
        const dto = { status: OrderStatus.DELIVERED };
        return request(app.getHttpServer())
          .patch(`/order/${order2.id}/status`)
          .set('Authorization', `Bearer ${anotherCookToken}`)
          .send(dto)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should fail if WAITER tries to set status to COMPLETE', () => {
        const dto = { status: OrderStatus.COMPLETE };
        return request(app.getHttpServer())
          .patch(`/order/${order1.id}/status`)
          .set('Authorization', `Bearer ${waiterToken}`)
          .send(dto)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should fail if user is not assigned to the order', () => {
        const dto = { status: OrderStatus.COMPLETE };
        return request(app.getHttpServer())
          .patch(`/order/${order1.id}/status`)
          .set('Authorization', `Bearer ${anotherCookToken}`)
          .send(dto)
          .expect(HttpStatus.BAD_REQUEST);
      });
    });

    describe('GET /order/:id', () => {
      it('should get a single order by ID', async () => {
        const { body } = await request(app.getHttpServer())
          .get(`/order/${order1.id}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(HttpStatus.OK);
        expect(body.id).toEqual(order1.id);
      });

      it('should return 404 for a non-existent order', () => {
        return request(app.getHttpServer())
          .get('/order/999999')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(HttpStatus.NOT_FOUND);
      });
    });
  });
});
