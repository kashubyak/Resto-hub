import { type INestApplication } from '@nestjs/common'
import { type PrismaService } from 'prisma/prisma.service'
import { CONNECTION_POOL_RELEASE_DELAY } from './constants'

export async function closeTestApp(
	app: INestApplication,
	prisma: PrismaService,
	additionalCleanup?: () => Promise<void>,
): Promise<void> {
	await prisma.$disconnect()
	if (additionalCleanup) await additionalCleanup()
	await app.close()
	await new Promise((resolve) =>
		setTimeout(resolve, CONNECTION_POOL_RELEASE_DELAY),
	)
}
