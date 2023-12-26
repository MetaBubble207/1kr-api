import { Entity, Index, ManyToOne, Unique } from 'typeorm';

import type { Relation } from 'typeorm';

import { BaseIntEntity } from '../../core/common/base.entity';
import { UserEntity } from '../../user/entities/user.entity';

import { PostEntity } from './post.entity';

@Entity('social_circle_post_likes')
@Unique('uniq_user_post', ['user', 'post'])
@Index('idx_post', ['post', 'createdAt'])
export class PostLikeEntity extends BaseIntEntity {
    @ManyToOne(() => UserEntity, (user) => user.postLikes)
    user: Relation<UserEntity>;

    @ManyToOne(() => PostEntity, (post) => post.likes)
    post: Relation<PostEntity>;
}
