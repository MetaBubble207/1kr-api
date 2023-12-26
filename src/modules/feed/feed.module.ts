import { Module } from '@nestjs/common';

import { FollowService } from '../circle/services';
import { Configure } from '../config/configure';

import { addEntities } from '../database/helpers';

import * as entities from './entities';
import { FeedListener } from './feed.listener';
import { FeedService } from './feed.service';

@Module({})
export class FeedModule {
    static async forRoot(configure: Configure) {
        return {
            module: FeedModule,
            imports: [addEntities(configure, Object.values(entities))],
            providers: [FeedListener, FeedService, FollowService],
            exports: [FeedService],
        };
    }
}
