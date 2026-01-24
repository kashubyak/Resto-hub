import { faker } from '@faker-js/faker'

export class FakeDTO {
	static table = {
		create: () => ({
			number: faker.number.int({ min: 1, max: 100 }),
			seats: faker.number.int({ min: 2, max: 10 }),
		}),
	}

	static category = {
		create: () => ({
			name: faker.commerce.productName(),
		}),
	}

	static dish = {
		create: () => ({
			name: faker.commerce.product(),
			description: faker.commerce.productDescription(),
			price: faker.number.float({ min: 5, max: 100 }),
			imageUrl: faker.image.url(),
			ingredients: faker.helpers.arrayElements(
				['tomato'],
				faker.number.int({ min: 1, max: 5 }),
			),
			weightGr: faker.number.int({ min: 10, max: 1000 }),
			calories: faker.number.int({ min: 50, max: 800 }),
			available: faker.datatype.boolean(),
		}),
	}

	static order = {
		create: (dishId: number, tableId: number) => ({
			tableId,
			items: [
				{
					dishId,
					quantity: faker.number.int({ min: 1, max: 3 }),
					notes: faker.lorem.sentence(),
				},
			],
		}),
	}

	static user = {
		waiter: () => ({
			name: faker.person.fullName(),
			email: faker.internet.email({ provider: 'example.com' }),
			password: faker.internet.password(),
			role: 'WAITER' as const,
		}),
		cook: () => ({
			name: faker.person.fullName(),
			email: faker.internet.email({ provider: 'cook.example.com' }),
			password: faker.internet.password(),
			role: 'COOK' as const,
		}),
	}
}
