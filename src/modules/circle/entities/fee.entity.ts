import { Expose } from 'class-transformer';
import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseWithUpdatedEntity } from '@/modules/core/common/base.entity';

import { CircleFeeType } from '../circle.constant';

import { SocialCircleEntity } from './circle.entity';

@Entity('social_circle_fees')
export class SocialCircleFeeEntity extends BaseWithUpdatedEntity {
    @Expose()
    @ManyToOne(() => SocialCircleEntity, (circle) => circle.fees, {
        nullable: false,
    })
    circle: SocialCircleEntity;

    @Column({
        comment: '收费类型,1月付,2季度付,3年付,4终身',
        type: 'enum',
        enum: CircleFeeType,
    })
    type: CircleFeeType;

    @Column({ comment: '费用', unsigned: true })
    amount: number;
}
