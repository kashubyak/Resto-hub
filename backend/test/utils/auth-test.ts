import { INestApplication } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { ISubUserDto } from 'src/common/interface/user.interface'
import * as request from 'supertest'
import { BASE_URL, companyData, HOST, localhost, logoPath } from './constants'
import { attachCompanyFormFields, makeRequest } from './form-utils'

export const getAuthToken = async (
	app: INestApplication,
): Promise<{ token: string; companyId: number }> => {
	await attachCompanyFormFields(
		request(app.getHttpServer())
			.post(`${BASE_URL.AUTH}/register-company`)
			.set('Host', localhost),
		companyData,
	).expect(201)

	const loginRes = await request(app.getHttpServer())
		.post(`${BASE_URL.AUTH}/login`)
		.set('Host', HOST)
		.send({
			email: companyData.adminEmail,
			password: companyData.adminPassword,
		})
		.expect(200)

	const token = loginRes.body.token

	const prisma = app.get(PrismaService)
	const company = await prisma.company.findUniqueOrThrow({
		where: { subdomain: companyData.subdomain },
		select: { id: true },
	})

	return { token, companyId: company.id }
}

export const getAuthSubUser = async (
	app: INestApplication,
	adminToken: string,
	dto: ISubUserDto,
): Promise<{ token: string; id: number }> => {
	const registerRes = await makeRequest(
		app,
		adminToken,
		'post',
		`${BASE_URL.USER}/register`,
	)
		.field('name', dto.name)
		.field('email', dto.email)
		.field('password', dto.password)
		.field('role', dto.role)
		.attach('avatarUrl', logoPath)
		.expect(201)

	const id = registerRes.body.id
	if (!id) throw new Error('User registration response did not include an ID.')

	const loginRes = await request(app.getHttpServer())
		.post(`${BASE_URL.AUTH}/login`)
		.set('Host', HOST)
		.send({
			email: dto.email,
			password: dto.password,
		})
		.expect(200)

	const token = loginRes.body.token

	return { token, id }
}
