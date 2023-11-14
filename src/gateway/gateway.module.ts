// import { Module } from '@nestjs/common';
// import { PrismaModule } from 'src/prisma/prisma.module';

// @Module({
//   imports: [PrismaModule, HwsModule],
// })
// export class GatewayModule {}

import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { xyzGateway } from './xyz/xyz.gateway';
import { xyzGatewayService } from './xyz/xyz.service';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [PrismaModule, LoggerModule],
  providers: [xyzGateway, xyzGatewayService],
})
export class GatewayModule {}
