import { faker } from '@faker-js/faker'
import { config } from 'dotenv'

config({ path: '.env.test' })

faker.seed(12345)
