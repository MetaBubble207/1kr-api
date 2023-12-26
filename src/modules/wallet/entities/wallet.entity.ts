import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseIntWithUpdatedEntity } from '../../core/common/base.entity';
import { UserEntity } from '../../user/entities';

@Entity('user_wallet')
export class UserWalletEntity extends BaseIntWithUpdatedEntity {
    @OneToOne(() => UserEntity, (user) => user.wallet, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn()
    user: UserEntity;

    @Column({
        comment: '余额',
        unsigned: true,
        type: 'bigint',
        default: 0,
    })
    amount: number;
}
