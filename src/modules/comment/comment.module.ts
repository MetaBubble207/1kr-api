import { Module } from '@nestjs/common';
import { CommentService } from './services/comment.service';
import { CommentListener } from './comment.listener';
import { Configure } from '../config/configure';
import * as entities from './entities';
import { addEntities } from '../database/helpers';
import { DatabaseModule } from '../database/database.module';
import { CommentRepository } from './comment.repository';
import { VoteService } from './services/vote.service';

@Module({})
export class CommentModule {
    static async forRoot(configure: Configure) {
        return {
            module: CommentModule,
            imports: [addEntities(configure, Object.values(entities)), DatabaseModule.forRepository([CommentRepository])],
            providers: [CommentListener, CommentService, VoteService, CommentRepository],
            exports: [CommentService, VoteService],
        };
    }
}
