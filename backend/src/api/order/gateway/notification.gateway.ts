import { Injectable, Logger } from '@nestjs/common'
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'
import { Role } from '@prisma/client'
import * as jwt from 'jsonwebtoken'
import { Server, Socket } from 'socket.io'
import { socket_rooms } from 'src/common/constants'
import { type INotificationData } from '../interfaces/notification.interface'

interface ICustomJwtPayload {
	sub: number
	role: Role
	iat?: number
	exp?: number
}

interface ISocketData {
	userId: number
	role: Role
}

@WebSocketGateway({ cors: true, transports: ['websocket'] })
@Injectable()
export class NotificationsGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server!: Server
	private logger = new Logger(NotificationsGateway.name)

	async handleConnection(client: Socket) {
		try {
			const authToken =
				typeof client.handshake.auth.token === 'string'
					? client.handshake.auth.token
					: undefined
			const queryToken =
				typeof client.handshake.query.token === 'string'
					? client.handshake.query.token
					: undefined
			const headerToken =
				typeof client.handshake.headers.authorization === 'string'
					? client.handshake.headers.authorization.split(' ')[1]
					: undefined

			const token: string | undefined = authToken ?? queryToken ?? headerToken

			if (!token) throw new Error('Token is missing')
			const secret = process.env.JWT_TOKEN_SECRET
			if (!secret) throw new Error('JWT_TOKEN_SECRET is not defined')
			const decoded = jwt.verify(token, secret)

			if (typeof decoded === 'string') throw new Error('Invalid token format')
			const payload = decoded as unknown as ICustomJwtPayload
			if (typeof payload.sub !== 'number' || typeof payload.role !== 'string')
				throw new Error('Invalid token payload')

			const userId: number = payload.sub
			const role: Role = payload.role

			;(client.data as ISocketData).userId = userId
			;(client.data as ISocketData).role = role

			if (role === Role.COOK) await client.join(socket_rooms.KITCHEN)
			else if (role === Role.WAITER)
				await client.join(socket_rooms.WAITER(userId))

			this.logger.log(`User ${userId} connected as ${role}`)
		} catch (err) {
			this.logger.error('Error during connection', err)
			client.disconnect()
		}
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
}
