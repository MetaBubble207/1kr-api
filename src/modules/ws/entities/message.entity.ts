import {
    BaseEntity,
    Column,
    Entity,
    Index,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Index('idx_circle_sendTime', ['circleId', 'sendTime'])
@Entity('chat_messages')
export class MessageEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ comment: '圈子ID', type: 'char', length: 36 })
    circleId: string;

    @Column({ comment: '用户ID', type: 'char', length: 36 })
    userId: string;

    @Column({ comment: '消息类型', default: 'text' })
    type: string;

    @Column({ comment: '内容', length: 10000 })
    content: string;

    @Column({ comment: '引用ID', unsigned: true, default: 0 })
    parentId: number;

    @Column({
        comment: '发送时间戳',
        unsigned: true,
        default: 0,
    })
    sendTime: number;
}
