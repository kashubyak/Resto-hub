import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'
import { Role } from '@prisma/client'
import { Server, Socket } from 'socket.io'
import { SupabaseTokenVerifierService } from 'src/common/auth/supabase-token-verifier.service'
import { socket_rooms } from 'src/common/constants'
import { WEBSOCKET_CORS_OPTIONS } from 'src/common/utils/cors-origin.util'
import { parseAccessTokenFromCookieHeader } from 'src/common/utils/cookie.util'
import { getSubdomainFromHost } from 'src/common/utils/subdomain.util'
import { type INotificationData } from '../interfaces/notification.interface'

interface ISocketData {
	userId: number
	role: Role
}

@WebSocketGateway({
	cors: WEBSOCKET_CORS_OPTIONS,
	transports: ['websocket'],
})
@Injectable()
export class NotificationsGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server!: Server
	private logger = new Logger(NotificationsGateway.name)

	constructor(
		private readonly prisma: PrismaService,
		private readonly tokenVerifier: SupabaseTokenVerifierService,
	) {}

	async handleConnection(client: Socket) {
		try {
			const token = this.extractToken(client)
			if (!token) throw new Error('Token is missing')

			const { sub } = await this.tokenVerifier.verifyAccessToken(token)

			const host =
				(typeof client.handshake.headers.host === 'string'
					? client.handshake.headers.host
					: '') ||
				(typeof client.handshake.headers['x-forwarded-host'] === 'string'
					? client.handshake.headers['x-forwarded-host']
					: '')
			const subdomain = getSubdomainFromHost(host)
			if (!subdomain) throw new Error('Subdomain is required')

			const company = await this.prisma.company.findUnique({
				where: { subdomain },
				select: { id: true },
			})
			if (!company) throw new Error('Company not found')

			const user = await this.prisma.user.findFirst({
				where: {
					supabaseUserId: sub,
					companyId: company.id,
				} as { supabaseUserId: string; companyId: number },
				select: { id: true, role: true, companyId: true },
			})
			if (!user) throw new Error('User not found in company')

			const userId = user.id
			const role = user.role

			;(client.data as ISocketData).userId = userId
			;(client.data as ISocketData).role = role

			await client.join(socket_rooms.USER(userId))
			await client.join(socket_rooms.COMPANY(user.companyId))
			if (role === Role.COOK) await client.join(socket_rooms.KITCHEN)
			else if (role === Role.WAITER)
				await client.join(socket_rooms.WAITER(userId))

			this.logger.log(`User ${userId} connected as ${role}`)
		} catch (err) {
			this.logger.error('Error during connection', err)
			client.disconnect()
		}
	}

	private getCookieHeader(client: Socket): string | undefined {
		const fromHandshake = client.handshake.headers.cookie
		if (typeof fromHandshake === 'string' && fromHandshake.length > 0)
			return fromHandshake

		const fromRequest = client.request.headers.cookie
		if (typeof fromRequest === 'string' && fromRequest.length > 0)
			return fromRequest

		return undefined
	}

	private extractToken(client: Socket): string | undefined {
		const cookieToken = parseAccessTokenFromCookieHeader(
			this.getCookieHeader(client),
		)
		if (cookieToken) return cookieToken

		const authToken =
			typeof client.handshake.auth.token === 'string'
				? client.handshake.auth.token
				: undefined
		if (authToken) return authToken

		const queryToken =
			typeof client.handshake.query.token === 'string'
				? client.handshake.query.token
				: undefined
		if (queryToken) return queryToken

		const authHeader = client.handshake.headers.authorization
		if (typeof authHeader === 'string' && authHeader.startsWith('Bearer '))
			return authHeader.slice(7)

		return undefined
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`)
	}
	notifyKitchen(event: string, data: INotificationData): void {
		this.server.to(socket_rooms.KITCHEN).emit(event, data)
	}
	notifyWaiter(event: string, data: INotificationData, waiterId: number): void {
		this.server.to(socket_rooms.WAITER(waiterId)).emit(event, data)
	}
	notifyCompany(
		companyId: number,
		event: string,
		data: INotificationData,
	): void {
		this.server.to(socket_rooms.COMPANY(companyId)).emit(event, data)
	}
}
