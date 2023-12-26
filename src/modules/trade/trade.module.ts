import { Module } from '@nestjs/common';

import { Configure } from '../config/configure';
import { addEntities } from '../database/helpers';

import * as entities from './entities';
import { TradeService } from './trade.service';

@Module({})
export class TradeModule {
    static async forRoot(configure: Configure) {
        return {
            module: TradeModule,
            imports: [addEntities(configure, Object.values(entities))],
            providers: [TradeService],
            exports: [TradeService],
            global: true,
        };
    }
}
