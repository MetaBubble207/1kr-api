import { Module } from '@nestjs/common';

import { Configure } from '../config/configure';

import { DatabaseModule } from '../database/database.module';
import { addEntities } from '../database/helpers';

import { CommentListener } from './comment.listener';
import { CommentRepository } from './comment.repository';
import * as entities from './entities';
import { CommentService } from './services/comment.service';
import { VoteService } from './services/vote.service';

@Module({})
export class CommentModule {
    static async forRoot(configure: Configure) {
        return {
            module: CommentModule,
            imports: [
                addEntities(configure, Object.values(entities)),
                DatabaseModule.forRepository([CommentRepository]),
            ],
            providers: [CommentListener, CommentService, VoteService, CommentRepository],
            exports: [CommentService, VoteService],
        };
    }
}
