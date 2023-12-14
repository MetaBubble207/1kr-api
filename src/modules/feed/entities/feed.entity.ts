import { Exclude } from 'class-transformer';
import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

/**
 * 关注feed流
 */
@Exclude()
@Entity('feeds')
@Unique('uniq_user_post', ['userId', 'postId'])
@Index('idx_circle_user', ['circleId', 'userId'])
@Index('idx_publishTime', ['userId', 'publishTime', 'postId'])
export class FeedEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        comment: '用户ID',
    })
    userId: string;

    @Column({
        comment: '文章ID',
    })
    postId: string;

    @Column({
        comment: '圈子ID',
    })
    circleId: string;

    @Column({
        comment: '发布时间戳',
        unsigned: true,
    })
    publishTime: number;
}
