import { Inject, OnModuleInit, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';
import { Namespace, Socket } from 'socket.io';
import { JwtWebSocketGuard } from '../strategy/jwt.websocket.guard';
import { xyzGatewayService } from './xyz.service';

@WebSocketGateway({ namespace: 'xyz' })
export class xyzGateway implements OnModuleInit {
  constructor(
    private readonly myGatewayService: xyzGatewayService,
    @Inject(ConfigService) private readonly config: ConfigService,
  ) {}
  @WebSocketServer()
  server: Namespace;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      const JWT = socket.handshake.headers.authorization;
      const SECRECT = this.config.get('JWT_SECRET');
      jwt.verify(JWT, SECRECT, (err, decoded) => {
        if (err) {
          // Token is invalid; you can close the connection or handle it as needed
          socket.disconnect();
        } else {
          // Handle the WebSocket connection for the authenticated user
          this.server
            .to(socket.id)
            .emit('app/subscribe', { msg: `connected id = ${socket.id}` });
          console.log('=================================');
          console.log(socket.id);
          console.log('=================================');
          console.log(socket.handshake.headers.authorization);
          console.log('=================================');
          console.log(socket.client);
          console.log('=================================');
          console.log(decoded);
          console.log('=================================');
        }
      });
    });
  }

  @SubscribeMessage('app/publish')
  @UseGuards(JwtWebSocketGuard)
  async NewMessage(
    @Req() req: any,
    @MessageBody() newMessageDto: any,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(req.user.id);
    const result = await this.myGatewayService.NewMessage(newMessageDto);
    this.server.to(socket.id).emit('app/subscribe', result);
  }
}
