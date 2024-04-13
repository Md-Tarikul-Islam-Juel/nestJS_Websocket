import {Inject, OnModuleInit, Req, UseGuards} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import {Namespace, Socket} from 'socket.io';
import {WebSocketGatewayService} from '../services/socket.service';
import {JwtSocketStrategy} from "../../jwt/strategys/jwt-socket.strategy";


@WebSocketGateway({namespace: 'xyz'})
export class socketGateway implements OnModuleInit {
    constructor(
        private readonly webSocketGatewayService: WebSocketGatewayService,
        @Inject(ConfigService) private readonly config: ConfigService,
    ) {
    }

    @WebSocketServer()
    server: Namespace;

    @UseGuards(JwtSocketStrategy)
    onModuleInit() {
        this.server.on('connection', (socket) => {
            // Handle the WebSocket connection for the authenticated user
            this.server
                .to(socket.id)
                .emit('app/subscribe', {msg: `connected id = ${socket.id}`});
            console.log('=================================');
            console.log(`socket connected Id = ${socket.id}`);
            console.log('=================================');
            // console.log(socket.handshake.headers.authorization);
            // console.log('=================================');
            // console.log(socket.client);
            // console.log('=================================');
        });
    }

    @SubscribeMessage('app/publish')
    @UseGuards(JwtSocketStrategy)
    async NewMessage(
        @Req() req: any,
        @MessageBody() newMessageData: any,
        @ConnectedSocket() socket: Socket,
    ) {
        // console.log(req.user.id);
        const result = this.webSocketGatewayService.NewMessage(newMessageData);
        this.server.to(socket.id).emit('app/subscribe', result);
    }
}
