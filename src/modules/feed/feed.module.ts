import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedListener } from './feed.listener';
import { Configure } from '../config/configure';
import * as entities from './entities';
import { addEntities } from '../database/helpers';
import { FollowService } from '../circle/services';

@Module({})
export class FeedModule {
    static async forRoot(configure: Configure) {
        return {
            module: FeedModule,
            imports: [addEntities(configure, Object.values(entities))],
            providers: [FeedListener, FeedService, FollowService],
            exports: [FeedService]
        };
    }
}
