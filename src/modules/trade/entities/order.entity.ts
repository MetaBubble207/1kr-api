import { Column, Entity, ManyToOne } from 'typeorm';

import { CircleFeeType } from '../../circle/circle.constant';
import { SocialCircleEntity } from '../../circle/entities';
import { BaseWithDeletedEntity } from '../../core/common/base.entity';
import { UserEntity } from '../../user/entities';
import { UserWalletRechargeRecordEntity } from '../../wallet/entities';
import { PayStatus, PayType } from '../trade.constant';

@Entity('orders')
export class OrderEntity extends BaseWithDeletedEntity {
    @ManyToOne(() => UserEntity, (user) => user.orders, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    user: UserEntity;

    @ManyToOne(() => SocialCircleEntity, (circle) => circle.orders, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    circle: SocialCircleEntity;

    @Column({
        comment: '金额',
        unsigned: true,
        type: 'bigint',
        default: 0,
    })
    amount: number;

    @Column({
        comment: '支付方式',
        type: 'enum',
        enum: PayType,
    })
    payType: PayType;

    @Column({
        comment: '状态',
        type: 'enum',
        enum: PayStatus,
    })
    status: PayStatus;

    @Column({
        comment: '圈子套餐快照',
        type: 'simple-json',
    })
    circleFee: {
        type: CircleFeeType;
        amount: number;
    };

    rechargeRecord?: UserWalletRechargeRecordEntity;
}
