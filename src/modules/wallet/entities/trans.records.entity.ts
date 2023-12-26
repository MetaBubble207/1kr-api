import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { BaseIntWithDeletedEntity } from '../../core/common/base.entity';
import { UserEntity } from '../../user/entities';
import { TransType } from '../wallet.constant';

@Entity('user_wallet_trans_records')
@Index('idx_user_type', ['user', 'type'])
export class UserWalletTransRecordEntity extends BaseIntWithDeletedEntity {
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
        comment: '变动前余额',
        unsigned: true,
        type: 'bigint',
        default: 0,
    })
    beforeBalance: number;

    @Column({
        comment: '变动后余额',
        unsigned: true,
        type: 'bigint',
        default: 0,
    })
    afterBalance: number;

    @Column({
        comment: '类型',
        type: 'enum',
        enum: TransType,
    })
    type: TransType;
}
