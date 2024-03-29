import { Module } from '@nestjs/common';

import { Configure } from '../config/configure';

import { addEntities } from '../database/helpers';

import { CollectListener } from './collect.listener';
import { CollectService } from './collect.service';
import * as entities from './entities';

@Module({})
export class CollectModule {
    static async forRoot(configure: Configure) {
        return {
            module: CollectModule,
            imports: [addEntities(configure, Object.values(entities))],
            providers: [CollectService, CollectListener],
            exports: [CollectService],
        };
    }
}
