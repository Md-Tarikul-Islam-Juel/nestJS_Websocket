import {MailerModule} from '@nestjs-modules/mailer';
import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {AuthModule} from './modules/auth/auth.module';
import {LoggerModule} from './modules/logger/logger.module';
import {PrismaModule} from './modules/prisma/prisma.module';
import {AllExceptionsFilter} from "./modules/filters/all-exceptions.filter";
import {APP_FILTER} from "@nestjs/core";
import {UserModule} from './modules/user/user.module';
import {JwtConfigModule} from "./modules/jwt/jwt.module";
import {SocketModule} from "./modules/WebSocket/socket.module";


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        MailerModule.forRootAsync({
            useFactory: async (config: ConfigService) => ({
                transport: {
                    host: config.get('MAIL_HOST'),
                    auth: {
                        user: config.get('MAIL_USER'),
                        pass: config.get('MAIL_PASSWORD'),
                    },
                },
            }),
            inject: [ConfigService],
        }),

        AuthModule,
        PrismaModule,
        LoggerModule,
        UserModule,
        JwtConfigModule,
        SocketModule
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
    ]
})
export class AppModule {
}
