import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class xyzGatewayService {
  constructor(private logger: LoggerService) {}
  NewMessage(newMessageDto: any) {
    // console.log(newMessageDto);
    this.logger.info(newMessageDto, 'xyzGatewayService');
    return { msg: 'This response from server' };
  }
}
