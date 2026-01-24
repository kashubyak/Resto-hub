import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
	await prisma.orderItem.deleteMany()
	await prisma.order.deleteMany()
	await prisma.dish.deleteMany()
	await prisma.category.deleteMany()
	await prisma.table.deleteMany()
	await prisma.user.deleteMany()
	await prisma.company.deleteMany()

	console.log('Test DB seeded ✅')
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(() => prisma.$disconnect())
