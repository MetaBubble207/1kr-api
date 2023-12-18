import { Module } from '@nestjs/common';

import { Configure } from '../config/configure';
import { addEntities } from '../database/helpers';

import * as entities from './entities';
import { PostListener } from './post.listener';
import * as services from './services';
import { FollowService, MemberService } from '../circle/services';

@Module({})
export class PostModule {
    static async forRoot(configure: Configure) {
        return {
            module: PostModule,
            imports: [addEntities(configure, Object.values(entities))],
            providers: [PostListener, MemberService, FollowService, ...Object.values(services)],
            exports: [...Object.values(services)],
        };
    }
}
