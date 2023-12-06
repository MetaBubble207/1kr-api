import { Module } from '@nestjs/common';

import { Configure } from '../config/configure';

import { DatabaseModule } from '../database/database.module';
import { addEntities } from '../database/helpers';

import { CircleListener } from './circle.listener';
import { CircleService } from './circle.service';
import * as entities from './entities';
import * as repositories from './repositories';

@Module({})
export class CircleModule {
    static async forRoot(configure: Configure) {
        return {
            module: CircleModule,
            imports: [
                addEntities(configure, Object.values(entities)),
                DatabaseModule.forRepository(Object.values(repositories)),
            ],
            providers: [CircleService, CircleListener],
            exports: [CircleService],
        };
    }
}
