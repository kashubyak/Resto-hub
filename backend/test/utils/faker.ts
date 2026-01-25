import { faker } from '@faker-js/faker'

let tableNumberCounter = 1000
let categoryNameCounter = 0
let dishNameCounter = 0
let userEmailCounter = 0

export class FakeDTO {
	static table = {
		create: () => {
			tableNumberCounter++
			return {
				number: tableNumberCounter,
				seats: faker.number.int({ min: 2, max: 10 }),
			}
		},
	}

	static category = {
		create: () => {
			categoryNameCounter++
			return {
				name: `${faker.commerce.productName()}-${categoryNameCounter}`,
			}
		},
	}

	static dish = {
		create: () => {
			dishNameCounter++
			return {
				name: `${faker.commerce.product()}-${dishNameCounter}`,
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
			}
		},
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
		waiter: () => {
			userEmailCounter++
			return {
				name: faker.person.fullName(),
				email: `waiter-${userEmailCounter}@example.com`,
				password: faker.internet.password(),
				role: 'WAITER' as const,
			}
		},
		cook: () => {
			userEmailCounter++
			return {
				name: faker.person.fullName(),
				email: `cook-${userEmailCounter}@cook.example.com`,
				password: faker.internet.password(),
				role: 'COOK' as const,
			}
		},
	}
}
