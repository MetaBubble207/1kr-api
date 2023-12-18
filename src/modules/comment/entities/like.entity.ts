import { Expose } from 'class-transformer';
import { UserEntity } from '../../user/entities/user.entity';
import {
    Entity,
    Index,
    ManyToOne,
    Unique,
} from 'typeorm';
import { CommentEntity } from './comment.entity';
import { BaseIntEntity } from '../../core/common/base.entity';

@Expose()
@Entity('comment_likes')
@Unique('uniq_user_comment', ['user', 'comment'])
@Index('idx_comment', ['comment', 'createdAt'])
export class CommentLikeEntity extends BaseIntEntity {
    @ManyToOne(() => UserEntity, (user) => user.commentLikes)
    user: UserEntity;

    @ManyToOne(() => CommentEntity, (comment) => comment.likes)
    comment: CommentEntity;
}
