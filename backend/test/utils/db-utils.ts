import { type PrismaService } from 'prisma/prisma.service'

export async function cleanTestDb(prisma: PrismaService) {
	await prisma.orderItem.deleteMany()
	await prisma.order.deleteMany()
	await prisma.dish.deleteMany()
	await prisma.category.deleteMany()
	await prisma.table.deleteMany()
	await prisma.user.deleteMany()
	await prisma.company.deleteMany()
}
