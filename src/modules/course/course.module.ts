import { Module } from '@nestjs/common';

import { MemberService } from '../circle/services';
import { Configure } from '../config/configure';
import { addEntities } from '../database/helpers';

import * as entities from './entities';
import * as services from './services';

@Module({})
export class CourseModule {
    static async forRoot(configure: Configure) {
        return {
            module: CourseModule,
            imports: [addEntities(configure, Object.values(entities))],
            providers: [...Object.values(services), MemberService],
            exports: [...Object.values(services)],
        };
    }
}
