import {UseGuards} from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import {Namespace, Socket} from 'socket.io';
import {JwtSocketStrategy} from "../../jwt/strategys/jwt-socket.strategy";


@WebSocketGateway({namespace: 'xyz'})
export class SocketGateway implements OnGatewayConnection {

    constructor(private readonly jwtSocketStrategy: JwtSocketStrategy) {
    }

    @WebSocketServer()
    server: Namespace;

    async handleConnection(socket: Socket): Promise<void> {
        try {
            const canActivate = await this.jwtSocketStrategy.canActivate({
                switchToWs: () => ({getClient: () => socket}),
            } as any);

            if (!canActivate) {
                socket.disconnect(true);
            }

            // Handle the WebSocket connection for the authenticated user
            const roomName = socket.handshake.headers.room;
            socket.join(roomName);

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
        } catch (error) {
            console.error('Error handling connection:', error.message);
            socket.disconnect(true);
        }
    }

    @SubscribeMessage('app/publish')
    @UseGuards(JwtSocketStrategy)
    async newMessage(
        @ConnectedSocket() socket: Socket,
        @MessageBody() newMessageData: any,
    ) {
        try {
            this.server
                .to(socket.id)
                .emit('app/subscribe', 'This response from server');
        } catch (error) {
            console.error('Error handling new message:', error.message);
            socket.disconnect(true);
        }
    }
}
