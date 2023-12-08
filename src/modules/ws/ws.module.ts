import { Module } from '@nestjs/common';

import { MemberService } from '../circle/services';
import { Configure } from '../config/configure';

import { addEntities } from '../database/helpers';

import { MessageEntity } from './entities/message.entity';
import { EventGateway } from './event.gateway';
import { WsService } from './services/ws.service';

@Module({})
export class WsModule {
    static async forRoot(configure: Configure) {
        return {
            module: WsModule,
            imports: [addEntities(configure, [MessageEntity])],
            providers: [EventGateway, WsService, MemberService],
            exports: [WsService],
            global: true,
        };
    }
}
