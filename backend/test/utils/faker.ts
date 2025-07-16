import { faker } from '@faker-js/faker';

export class FakeDTO {
  static table = {
    create: () => ({
      number: faker.number.int({ min: 1, max: 100 }),
      seats: faker.number.int({ min: 2, max: 10 }),
    }),
  };

  static category = {
    create: () => ({
      name: faker.commerce.productName(),
    }),
  };
}
