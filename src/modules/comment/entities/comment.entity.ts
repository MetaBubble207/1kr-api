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
import { BaseIntWithDeletedEntity } from '@/modules/core/common/base.entity';
import { convertToFriendlyTime } from '@/modules/post/helpers';
import { DownvoterEntity, UpvoterEntity } from './vote.entity';

class InteractionInfo {
    liked = false;
    likeCount = 0;
    replyCount = 0;
}

@Exclude()
@Entity('comments')
@Tree('materialized-path')
@Index('idx_mpath', ['mpath'])
@Index('idx_post', ['post', 'createdAt'])
@Index('idx_user', ['user', 'createdAt'])
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
        eager: true,
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @Index()
    user: UserEntity;

    @Expose()
    @Column({
        comment: '内容',
        default: '',
    })
    content: string;

    @Expose()
    @Type(() => Number)
    @Column({ comment: '点赞数', default: 0 })
    likeCount: number;

    @Exclude()
    @Type(() => Number)
    @Column({ comment: '回复数量，只有根节点存储该值', default: 0 })
    replyCount: number;

    @Expose()
    @Type(() => Number)
    @Column({ comment: '赞成票数', default: 0 })
    upvoteCount: number;

    @Expose()
    @Type(() => Number)
    @Column({ comment: '反对票数', default: 0 })
    downvoteCount: number;

    @Expose()
    @Column({
        comment: '是否是最佳答案',
        default: false,
    })
    best: boolean;

    @TreeChildren()
    children: CommentEntity[];

    @TreeParent()
    parent: CommentEntity;

    likes: CommentLikeEntity[];

    upvoters: UpvoterEntity[];

    downvoters: DownvoterEntity[];

    createdAtFriendly: string;

    mpath?: string;

    @Expose()
    interaction_info: InteractionInfo;

    @AfterLoad()
    formatDateAndUrl() {
        this.createdAtFriendly = convertToFriendlyTime(this.createdAt);
    }
}
