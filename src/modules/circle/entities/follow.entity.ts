import { Expose } from 'class-transformer';

import { Entity, Index, ManyToOne, Unique } from 'typeorm';

import { BaseEntity } from '@/modules/core/common/base.entity';
import { UserEntity } from '@/modules/user/entities';

import { SocialCircleEntity } from './circle.entity';

@Unique('uniq_circel_user', ['circle', 'user'])
@Index('idx_circel_createdAt', ['circle', 'createdAt'])
@Index('idx_user_createdAt', ['user', 'createdAt'])
@Entity('social_circle_followers')
export class SocialCircleFollowerEntity extends BaseEntity {
    @Expose()
    @ManyToOne(() => UserEntity, (user) => user.follow_circles)
    user: UserEntity;

    @Expose()
    @ManyToOne(() => SocialCircleEntity, (circle) => circle.members)
    circle: SocialCircleEntity;
}
