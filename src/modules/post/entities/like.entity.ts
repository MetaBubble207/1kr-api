import { Type } from 'class-transformer';

import {
    BaseEntity,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';

import { UserEntity } from '../../user/entities/user.entity';

import { PostEntity } from './post.entity';

@Entity('social_circle_post_likes')
@Unique('uniq_user_post', ['user', 'post'])
@Index('idx_post', ['post', 'createdAt'])
export class PostLikeEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.post_likes)
    user: UserEntity;

    @ManyToOne(() => PostEntity, (post) => post.likes)
    post: PostEntity;

    @Type(() => Date)
    @CreateDateColumn({
        comment: '创建时间',
    })
    createdAt: Date;
}
