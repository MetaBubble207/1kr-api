import { Exclude, Expose, Type } from 'class-transformer';
import { PostEntity } from '../../post/entities/post.entity';
import { UserEntity } from '../../user/entities/user.entity';
import {
    AfterLoad,
    Column,
    Entity,
    Index,
    ManyToOne,
    Tree,
    TreeChildren,
    TreeParent,
} from 'typeorm';
import { CommentLikeEntity } from './like.entity';
import { BaseIntWithDeletedEntity, BaseWithDeletedEntity } from '@/modules/core/common/base.entity';
import { convertToFriendlyTime } from '@/modules/post/helpers';

class InteractionInfo {
    liked = false;
    likeCount = 0;
    replyCount = 0;
}

@Exclude()
@Entity('comments')
@Tree('materialized-path')
@Index('idx_mpath', ['mpath'])
export class CommentEntity extends BaseIntWithDeletedEntity {
    @Expose()
    @ManyToOne(() => PostEntity, (post) => post.comments, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @Index()
    post: PostEntity;

    @Expose()
    @ManyToOne(() => UserEntity, (user) => user.comments, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @Index()
    user: UserEntity;

    @Expose()
    @Column()
    content: string;

    @TreeChildren()
    children: CommentEntity[];

    @TreeParent()
    parent: CommentEntity;

    @Expose()
    @Type(() => Number)
    @Column({ comment: '点赞数', default: 0 })
    @Index()
    likeCount: number;

    @Exclude()
    @Type(() => Number)
    @Column({ comment: '回复数量，只有根节点存储该值', default: 0 })
    @Index()
    replyCount: number;

    likes: CommentLikeEntity[];

    createdAtFriendly: string;

    mpath?: string;

    @Expose()
    interaction_info: InteractionInfo;

    @AfterLoad()
    formatDateAndUrl() {
        this.createdAtFriendly = convertToFriendlyTime(this.createdAt);
    }
}
