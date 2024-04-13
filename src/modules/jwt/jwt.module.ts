import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {JwtHttpStrategy} from './strategys/jwt-http.strategy';
import {PrismaService} from 'src/modules/prisma/prisma.service';
import {JwtSocketStrategy} from "./strategys/jwt-socket.strategy";

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {expiresIn: '365d'},
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [JwtHttpStrategy, PrismaService, JwtSocketStrategy],
    exports: [JwtModule, PassportModule, JwtHttpStrategy, JwtSocketStrategy],
})
export class JwtConfigModule {
}
