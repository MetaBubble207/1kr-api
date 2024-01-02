import { Exclude, Expose, Type } from 'class-transformer';
import { AfterLoad, Column, Entity, Index, ManyToOne } from 'typeorm';

import { SocialCircleEntity } from '@/modules/circle/entities';
import { CollectPostEntity } from '@/modules/collect/entities/collect.entity';
import { CommentEntity } from '@/modules/content/entities';
import { BaseWithDeletedEntity } from '@/modules/core/common/base.entity';

import { SectionEntity } from '../../course/entities';
import { UserEntity } from '../../user/entities/user.entity';

import { convertToFriendlyTime } from '../helper';

import { BUSINESS } from '../post.constant';

import { PostLikeEntity } from './like.entity';

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
@Index('idx_circle_section_createdAt', ['circle', 'section', 'createdAt'])
@Index('idx_circle_commentCount', ['circle', 'commentCount'])
@Index('idx_circle_likeCount', ['circle', 'likeCount'])
export class PostEntity extends BaseWithDeletedEntity {
    @Column({
        comment: '业务',
        enum: BUSINESS,
        type: 'enum',
    })
    business: BUSINESS;

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
    @ManyToOne(() => SectionEntity, (section) => section.posts, { nullable: false })
    section: SectionEntity;

    // 有其他方案设置关联字段非null值吗，不然null值会影响索引效率
    @Column({
        default: '',
    })
    sectionId: string;

    @Expose()
    @Column({
        comment: '标题',
        default: '',
    })
    title: string;

    @Expose()
    @Column({
        comment: '内容',
        type: 'text',
    })
    content: string;

    @Expose()
    @Type(() => Number)
    @Column({ comment: '评论数', default: 0 })
    commentCount: number;

    @Expose()
    @Type(() => Number)
    @Column({ comment: '点赞数', default: 0 })
    likeCount: number;

    @Expose()
    @Type(() => Number)
    @Column({ comment: '转发数', default: 0 })
    repostCount: number;

    @Expose()
    @Type(() => Number)
    @Column({ comment: '收藏数', default: 0 })
    collectCount: number;

    @Expose()
    @Column({
        comment: '是否禁止新评论',
        default: false,
    })
    disableComment: boolean;

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
