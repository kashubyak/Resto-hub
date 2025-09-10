import { Injectable, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Role } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import { socket_rooms } from 'src/common/constants';

interface ICustomJwtPayload {
  sub: number;
  role: Role;
  iat?: number;
  exp?: number;
}

type NotificationData =
  | Record<string, unknown>
  | string
  | number
  | boolean
  | null;

@WebSocketGateway({ cors: true, transports: ['websocket'] })
@Injectable()
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private logger = new Logger(NotificationsGateway.name);

  async handleConnection(client: Socket) {
    try {
      const token: string | undefined =
        client.handshake.auth?.token ||
        client.handshake.query?.token ||
        (typeof client.handshake.headers?.authorization === 'string'
          ? client.handshake.headers.authorization.split(' ')[1]
          : undefined);

      if (!token) throw new Error('Token is missing');
      const secret = process.env.JWT_TOKEN_SECRET;
      if (!secret) throw new Error('JWT_TOKEN_SECRET is not defined');
      const decoded = jwt.verify(token, secret);

      if (typeof decoded === 'string') throw new Error('Invalid token format');
      const payload = decoded as unknown as ICustomJwtPayload;
      if (typeof payload.sub !== 'number' || !payload.role)
        throw new Error('Invalid token payload');

      const userId: number = payload.sub;
      const role: Role = payload.role;

      client.data.userId = userId;
      client.data.role = role;

      if (role === Role.COOK) await client.join(socket_rooms.KITCHEN);
      else if (role === Role.WAITER)
        await client.join(socket_rooms.WAITER(userId));

      this.logger.log(`User ${userId} connected as ${role}`);
    } catch (err) {
      this.logger.error('Error during connection', err);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
  notifyKitchen(event: string, data: NotificationData) {
    this.server.to(socket_rooms.KITCHEN).emit(event, data);
  }
  notifyWaiter(event: string, data: NotificationData, waiterId: number) {
    this.server.to(socket_rooms.WAITER(waiterId)).emit(event, data);
  }
}
