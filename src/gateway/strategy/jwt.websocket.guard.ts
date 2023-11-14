// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { PrismaService } from '../../prisma/prisma.service';

// @Injectable()
// export class JwtWebSocketGuard implements CanActivate {
//   constructor(
//     private readonly jwtService: JwtService,
//     private readonly prisma: PrismaService,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const client = context.switchToWs().getClient();
//     const JWT = client.handshake.headers.authorization;

//     if (!JWT) {
//       // No JWT token provided
//       return false;
//     }

//     try {
//       const payload = this.jwtService.verify(JWT);
//       const existingUser = await this.prisma.user.findUnique({
//         where: {
//           email: payload.email,
//         },
//       });

//       if (!existingUser) {
//         // User not found
//         return false;
//       }

//       const {
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         password,
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         isForgetPassword,
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         createdAt,
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         updatedAT,
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         verified,
//         ...restUser
//       } = existingUser;
//       const userWithoutSomeInfo = { ...restUser };

//       // Attach the user object to the client for future use
//       client.user = userWithoutSomeInfo;
//       return true;
//     } catch (err) {
//       // JWT verification failed
//       return false;
//     }
//   }
// }

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtWebSocketGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const JWT = client.handshake.headers.authorization;
    const SECRECT = this.config.get('JWT_SECRET');

    if (!JWT) {
      // No JWT token provided, disconnect the client
      client.disconnect();
      return false;
    }

    try {
      const decoded = jwt.verify(JWT, SECRECT);

      if (!decoded) {
        // Token is invalid; you can close the connection or handle it as needed
        client.disconnect();
        return false;
      }

      // Validate the JWT token and retrieve the user object
      const user = await this.validateJwtToken(decoded);

      if (!user) {
        // User not found or other validation failed, disconnect the client
        client.disconnect();
        return false;
      }

      // Attach the user object to the client for future use
      client.user = user;
      return true;
    } catch (err) {
      // JWT verification or validation failed, disconnect the
      client.disconnect();
      return false;
    }
  }

  private async validateJwtToken(decoded: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: decoded.id },
    });
    // console.log(user);
    return user;
  }
}
