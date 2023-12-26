import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, Unique } from 'typeorm';

import { BaseIntWithDeletedEntity } from '../../core/common/base.entity';
import { OrderEntity } from '../../trade/entities';
import { UserEntity } from '../../user/entities';
import { RechargeStatus } from '../wallet.constant';

@Entity('user_wallet_recharge_records')
@Index('idx_user', ['user'])
@Unique('uniq_order', ['order'])
export class UserWalletRechargeRecordEntity extends BaseIntWithDeletedEntity {
    @ManyToOne(() => UserEntity, (user) => user.transRecords, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    user: UserEntity;

    @OneToOne(() => OrderEntity, (order) => order.rechargeRecord, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn()
    order: OrderEntity;

    @Column({
        comment: '金额',
        unsigned: true,
        type: 'bigint',
        default: 0,
    })
    amount: number;

    @Column({
        comment: '状态',
        type: 'enum',
        enum: RechargeStatus,
    })
    status: RechargeStatus;
}
