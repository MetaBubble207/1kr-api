import { Module } from '@nestjs/common';

import { Configure } from '../config/configure';

import { DatabaseModule } from '../database/database.module';
import { addEntities } from '../database/helpers';

import { CircleListener } from './circle.listener';
import * as entities from './entities';
import * as repositories from './repositories';
import * as services from './services';

@Module({})
export class CircleModule {
    static async forRoot(configure: Configure) {
        return {
            module: CircleModule,
            imports: [
                addEntities(configure, Object.values(entities)),
                DatabaseModule.forRepository(Object.values(repositories)),
            ],
            providers: [CircleListener, ...Object.values(services)],
            exports: [...Object.values(services)],
        };
    }
}
