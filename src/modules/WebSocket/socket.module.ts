import {Module} from '@nestjs/common';


import {SocketGateway} from './gateways/socket.gateway';
import {LoggerModule} from "../logger/logger.module";
import {JwtConfigModule} from "../jwt/jwt.module";

@Module({
    imports: [ LoggerModule, JwtConfigModule],
    providers: [SocketGateway],
})
export class SocketModule {
}
