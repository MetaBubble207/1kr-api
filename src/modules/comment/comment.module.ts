import { Module } from '@nestjs/common';
import { CommentService } from './services/comment.service';
import { CommentListener } from './comment.listener';
import { Configure } from '../config/configure';
import * as entities from './entities';
import { addEntities } from '../database/helpers';
import { LikeService } from '../post/services';
import { DatabaseModule } from '../database/database.module';
import { CommentRepository } from './comment.repository';

@Module({})
export class CommentModule {
    static async forRoot(configure: Configure) {
        return {
            module: CommentModule,
            imports: [addEntities(configure, Object.values(entities)), DatabaseModule.forRepository([CommentRepository]),],
            providers: [CommentListener, CommentService, LikeService, CommentRepository],
        };
    }
}
