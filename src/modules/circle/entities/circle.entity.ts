import { Exclude, Expose } from 'class-transformer';
import { AfterLoad, Column, Entity, Index, ManyToOne, Unique } from 'typeorm';

import { BaseEntity, BaseWithUpdatedEntity } from '@/modules/core/common/base.entity';
import { UserEntity } from '@/modules/user/entities';

import { SocialCircleFeeEntity } from './fee.entity';
import { SocialCircleTagEntity } from './tag.entity';

@Index('idx_user', ['user'])
@Unique('uniq_name', ['name'])
@Entity('social_circles')
@Exclude()
export class SocialCircleEntity extends BaseWithUpdatedEntity {
    @Expose()
    @ManyToOne(() => UserEntity, (user) => user.posts, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    user: UserEntity;

    @Expose()
    @Column({ comment: '是否免费' })
    free: boolean;

    @Expose()
    @Column({ comment: '名称', type: 'char', length: 15 })
    name: string;

    @Expose()
    @Column({ comment: '描述' })
    description: string;

    @Column({ comment: '封面图片' })
    cover: string;

    @Column({ comment: '背景图片' })
    bgImage: string;

    @Expose()
    @Column({ comment: '成员数量' })
    memberCount: number;

    @Expose()
    @Column({ comment: '关注者数量' })
    followerCount: number;

    members: SocialCircleUserEntity[];

    tags: SocialCircleTagEntity[];

    fees: SocialCircleFeeEntity[];

    @Expose()
    coverUrl: string;

    @Expose()
    bgImageUrl: string;

    @AfterLoad()
    buildUp() {
        // todo oss组装
        this.coverUrl = '';
        this.bgImageUrl = '';
    }
}

@Unique('uniq_circel_user', ['circle', 'user'])
@Index('idx_circel_createdAt', ['circle', 'createdAt'])
@Index('idx_user_createdAt', ['user', 'createdAt'])
@Entity('social_circle_users')
export class SocialCircleUserEntity extends BaseEntity {
    @Expose()
    @ManyToOne(() => UserEntity, (user) => user.circles)
    user: UserEntity;

    @Expose()
    @ManyToOne(() => SocialCircleEntity, (circle) => circle.members)
    circle: SocialCircleEntity;

    @Column({ comment: '到期时间戳', default: 0, unsigned: true, type: 'int' })
    expiredTime: number;
}
