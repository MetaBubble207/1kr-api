import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { BaseIntWithDeletedEntity } from '../../core/common/base.entity';
import { UserEntity } from '../../user/entities';
import { WithdrawStatus } from '../wallet.constant';

@Entity('user_wallet_withdraw_records')
@Index('idx_user', ['user'])
export class UserWalletWithdrawRecordEntity extends BaseIntWithDeletedEntity {
    @ManyToOne(() => UserEntity, (user) => user.transRecords, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    user: UserEntity;

    @Column({
        comment: '金额',
        unsigned: true,
        type: 'bigint',
        default: 0,
    })
    amount: number;

    @Column({
        comment: '提现手续费',
        unsigned: true,
        type: 'bigint',
        default: 0,
    })
    fee: number;

    @Column({
        comment: '提现手续费率',
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0,
    })
    feeRate: number;

    @Column({
        comment: '状态',
        type: 'enum',
        enum: WithdrawStatus,
    })
    status: WithdrawStatus;

    @Column({
        comment: '审核结果',
        default: '',
    })
    auditResult: string;
}
