import { Exclude, Expose, Type } from 'class-transformer';
import { AfterLoad, Column, Entity, Index, ManyToOne } from 'typeorm';

import { SocialCircleEntity } from '@/modules/circle/entities';
import { CollectPostEntity } from '@/modules/collect/entities/collect.entity';
import { BaseWithDeletedEntity } from '@/modules/core/common/base.entity';

import { UserEntity } from '../../user/entities/user.entity';

import { convertToFriendlyTime } from '../helpers';

import { PostLikeEntity } from './like.entity';
import { CommentEntity } from '@/modules/content/entities';

class InteractionInfo {
    liked = false;

    likeCount = 0;

    commentCount = 0;

    repostCount = 0;

    collectCount = 0;
}

@Exclude()
@Entity('social_circle_posts')
@Index('idx_user', ['user'])
@Index('idx_circle_createdAt', ['circle', 'createdAt'])
@Index('idx_circle_commentCount', ['circle', 'commentCount'])
@Index('idx_circle_likeCount', ['circle', 'likeCount'])
export class PostEntity extends BaseWithDeletedEntity {
    @Expose()
    @ManyToOne(() => UserEntity, (user) => user.posts, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    user: UserEntity;

    @Expose()
    @ManyToOne(() => SocialCircleEntity, (circle) => circle.posts, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    circle: SocialCircleEntity;

    @Expose()
    @Column({
        comment: '标题',
        default: '',
    })
    title: string;

    @Expose()
    @Column({
        comment: '内容',
        default: '',
        length: 10000,
    })
    content: string;

    @Type(() => Number)
    @Column({ comment: '评论数', default: 0 })
    commentCount: number;

    @Type(() => Number)
    @Column({ comment: '点赞数', default: 0 })
    likeCount: number;

    @Type(() => Number)
    @Column({ comment: '转发数', default: 0 })
    repostCount: number;

    @Type(() => Number)
    @Column({ comment: '收藏数', default: 0 })
    collectCount: number;

    @Expose()
    createdAtFriendly: string;

    @Expose()
    interactionInfo: InteractionInfo;

    likes: PostLikeEntity[];

    collects: CollectPostEntity[];

    comments: CommentEntity[];

    @AfterLoad()
    formatDateAndUrl() {
        this.createdAtFriendly = convertToFriendlyTime(this.createdAt);
    }
}
