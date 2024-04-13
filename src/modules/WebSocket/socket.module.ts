import {Module} from '@nestjs/common';


import {socketGateway} from './gateways/socket.gateway';
import {WebSocketGatewayService} from './services/socket.service';
import {LoggerModule} from "../logger/logger.module";
import {PrismaModule} from "../prisma/prisma.module";
import {JwtConfigModule} from "../jwt/jwt.module";

@Module({
    imports: [PrismaModule, LoggerModule, JwtConfigModule],
    providers: [socketGateway, WebSocketGatewayService],
})
export class SocketModule {
}
