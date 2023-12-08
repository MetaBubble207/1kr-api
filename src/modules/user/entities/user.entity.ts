import { Exclude, Expose, Type } from 'class-transformer';

import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

import type { Relation } from 'typeorm';

import { AccessTokenEntity } from './access-token.entity';

/**
 * 用户模型
 */
@Exclude()
@Entity('users')
export class UserEntity extends BaseEntity {
    [key: string]: any;

    @Expose({ groups: ['user-list', 'user-detail', 'chats'] })
    @PrimaryColumn({ type: 'varchar', generated: 'uuid', length: 36 })
    id: string;

    @Expose({ groups: ['user-list', 'user-detail', 'chats'] })
    @Column({
        comment: '姓名',
        nullable: true,
    })
    nickname?: string;

    @Expose({ groups: ['user-list', 'user-detail', 'chats'] })
    @Column({ comment: '用户名', unique: true })
    username: string;

    @Column({ comment: '密码', length: 500, select: false })
    password: string;

    @Expose({ groups: ['user-list', 'user-detail'] })
    @Column({ comment: '手机号', nullable: true, unique: true })
    phone?: string;

    @Expose({ groups: ['user-list', 'user-detail'] })
    @Column({ comment: '邮箱', nullable: true, unique: true })
    email?: string;

    @Expose({ groups: ['user-list', 'user-detail'] })
    @Type(() => Date)
    @CreateDateColumn({
        comment: '用户创建时间',
    })
    createdAt: Date;

    @Expose({ groups: ['user-list', 'user-detail'] })
    @Type(() => Date)
    @UpdateDateColumn({
        comment: '用户更新时间',
    })
    updatedAt: Date;

    @OneToMany(() => AccessTokenEntity, (accessToken) => accessToken.user, {
        cascade: true,
    })
    accessTokens: Relation<AccessTokenEntity>[];

    @Type(() => Date)
    @DeleteDateColumn({
        comment: '删除时间',
    })
    deletedAt: Date;
}
