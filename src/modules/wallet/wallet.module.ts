import { Module } from '@nestjs/common';

import { Configure } from '../config/configure';
import { addEntities } from '../database/helpers';

import * as entities from './entities';
import * as services from './services';
import { WalletListener } from './wallet.listener';

@Module({})
export class WalletModule {
    static async forRoot(configure: Configure) {
        return {
            module: WalletModule,
            imports: [addEntities(configure, Object.values(entities))],
            providers: [...Object.values(services), WalletListener],
            exports: [...Object.values(services)],
            global: true,
        };
    }
}
