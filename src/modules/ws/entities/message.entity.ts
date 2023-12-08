import { Exclude, Expose } from 'class-transformer';
import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from '@/modules/user/entities';

@Exclude()
@Index('idx_circle_sendTime', ['circleId', 'sendTime'])
@Entity('chat_messages')
export class MessageEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ comment: '圈子ID', type: 'char', length: 36 })
    circleId: string;

    @Column({ comment: '用户ID', type: 'char', length: 36 })
    userId: string;

    @Expose()
    @Column({ comment: '消息类型', default: 'text' })
    type: string;

    @Expose()
    @Column({ comment: '内容', length: 10000 })
    content: string;

    @Column({ comment: '引用ID', unsigned: true, default: 0 })
    parentId: number;

    @Expose()
    @Column({
        comment: '发送时间戳',
        unsigned: true,
        default: 0,
    })
    sendTime: number;

    @Expose()
    user: UserEntity;
}
