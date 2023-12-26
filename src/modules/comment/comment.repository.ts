import { Injectable } from '@nestjs/common';
import { TreeRepository } from 'typeorm';

import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentRepository extends TreeRepository<CommentEntity> {}
