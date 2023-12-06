import { Module } from '@nestjs/common';

import { Configure } from '../config/configure';

import { EventGateway } from './event.gateway';
import { WsService } from './ws.service';

@Module({})
export class WsModule {
    static async forRoot(configure: Configure) {
        return {
            module: WsModule,
            providers: [EventGateway, WsService],
            exports: [WsService],
        };
    }
}
