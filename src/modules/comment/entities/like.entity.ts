import { Expose, Type } from 'class-transformer';
import { UserEntity } from '../../user/entities/user.entity';
import {
    BaseEntity,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { CommentEntity } from './comment.entity';

@Expose()
@Entity('comment_likes')
@Unique('uniq_user_comment', ['user', 'comment'])
@Index('idx_comment', ['comment', 'createdAt'])
export class CommentLikeEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.commentLikes)
    user: UserEntity;

    @ManyToOne(() => CommentEntity, (comment) => comment.likes)
    comment: CommentEntity;

    @Type(() => Date)
    @CreateDateColumn({
        comment: '创建时间',
    })
    createdAt: Date;
}
