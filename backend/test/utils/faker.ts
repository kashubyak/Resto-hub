import { faker } from '@faker-js/faker';

export function fakeTable() {
  return {
    number: faker.number.int({ min: 1, max: 100 }),
    seats: faker.number.int({ min: 2, max: 10 }),
  };
}
