import { Entity, Index, ManyToOne, Unique } from 'typeorm';

import { BaseIntEntity } from '../../core/common/base.entity';
import { UserEntity } from '../../user/entities';

import { CommentEntity } from './comment.entity';

@Entity('comment_upvoters')
@Unique('uniq_user_comment', ['user', 'comment'])
@Index('idx_comment', ['comment', 'createdAt'])
export class UpvoterEntity extends BaseIntEntity {
    @ManyToOne(() => UserEntity, (user) => user.upvotes)
    user: UserEntity;

    @ManyToOne(() => CommentEntity, (comment) => comment.upvoters)
    comment: CommentEntity;
}

@Entity('comment_downvoters')
@Unique('uniq_user_comment', ['user', 'comment'])
@Index('idx_comment', ['comment', 'createdAt'])
export class DownvoterEntity extends BaseIntEntity {
    @ManyToOne(() => UserEntity, (user) => user.downvotes)
    user: UserEntity;

    @ManyToOne(() => CommentEntity, (comment) => comment.downvoters)
    comment: CommentEntity;
}
