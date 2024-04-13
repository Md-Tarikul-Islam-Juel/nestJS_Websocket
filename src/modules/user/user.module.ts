import {Module} from '@nestjs/common';
import {UserService} from './services/user.service';
import {UserController} from './controllers/user.controller';
import {PrismaModule} from "../prisma/prisma.module";
import {LoggerModule} from "../logger/logger.module";
import {JwtConfigModule} from "../jwt/jwt.module";
import {JwtHttpStrategy} from "../jwt/strategys/jwt-http.strategy";

@Module({
    imports: [
        PrismaModule,
        LoggerModule,
        JwtConfigModule
    ],
    providers: [UserService, JwtHttpStrategy],
    controllers: [UserController]
})
export class UserModule {
}
