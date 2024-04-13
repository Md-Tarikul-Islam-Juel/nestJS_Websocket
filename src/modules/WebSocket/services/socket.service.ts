import {Injectable} from '@nestjs/common';
import {LoggerService} from "../../logger/services/logger.service";

@Injectable()
export class WebSocketGatewayService {
    constructor(private logger: LoggerService) {
    }

    NewMessage(newMessageDto: any) {
        this.logger.info(`data received from app client`, `${this.constructor.name}.NewMessage():`);
        return {msg: 'This response from server'};
    }
}
