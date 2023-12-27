import { BadRequestException, Injectable } from '@nestjs/common';

import { EventEmitter2 } from '@nestjs/event-emitter';

import { UserEntity } from '../../user/entities';
import { UserWalletEntity, UserWalletWithdrawRecordEntity } from '../entities';
import { WithdrawAuditFailedEvent } from '../events/withdrawAuditFailed.event';
import { WithdrawAuditPassEvent } from '../events/withdrawAuditPass.event';
import { WithdrawStatus } from '../wallet.constant';

@Injectable()
export class WithdrawService {
    constructor(private readonly eventEmitter: EventEmitter2) {}

    /**
     * 申请提现
     * @param user
     * @param amount
     */
    async apply(user: UserEntity, amount: number) {
        const result = await UserWalletEntity.createQueryBuilder('wallet')
            .leftJoinAndSelect('wallet.user', 'user')
            .update()
            .where('user.id = :userId', { userId: user.id })
            .andWhere('wallet.amount >= :amount', { amount })
            .set({
                amount: () => `amount - ${amount}`,
            })
            .execute();
        if (result.raw.affectedRows === 0) {
            throw new BadRequestException('可提现金额不足');
        }

        // todo 手续费
        UserWalletWithdrawRecordEntity.save({
            user,
            amount,
            status: WithdrawStatus.Pending,
        });
    }

    /**
     * 取消申请
     * @param withdrawRecord
     */
    async cancleApply(withdrawRecord: UserWalletWithdrawRecordEntity) {
        UserWalletWithdrawRecordEntity.createQueryBuilder()
            .delete()
            .where('id = :id', { id: withdrawRecord.id })
            .andWhere('status = :status', { status: WithdrawStatus.Pending })
            .execute();
    }

    /**
     * 审核通过
     * @param withdrawRecord
     */
    async auditPass(withdrawRecord: UserWalletWithdrawRecordEntity) {
        const result = await UserWalletWithdrawRecordEntity.createQueryBuilder()
            .update()
            .where('id = :id', { id: withdrawRecord.id })
            .andWhere('status = :status', { status: WithdrawStatus.Pending })
            .set({
                status: WithdrawStatus.AuditPass,
            })
            .execute();
        if (result.raw.affectedRows === 0) {
            throw new BadRequestException('请勿重复审核');
        }

        // todo 发起转账

        this.eventEmitter.emit(
            'withdraw.auditPass',
            new WithdrawAuditPassEvent({
                applyId: withdrawRecord.id,
            }),
        );
    }

    /**
     * 审核失败
     * @param withdrawRecord
     * @param reason
     */
    async auditFailed(withdrawRecord: UserWalletWithdrawRecordEntity, reason: string = '') {
        const result = await UserWalletWithdrawRecordEntity.createQueryBuilder()
            .update()
            .where('id = :id', { id: withdrawRecord.id })
            .andWhere('status = :status', { status: WithdrawStatus.Pending })
            .set({
                status: WithdrawStatus.AuditFailed,
            })
            .execute();
        if (result.raw.affectedRows === 0) {
            throw new BadRequestException('请勿重复审核');
        }

        if (reason) {
            withdrawRecord.auditResult = reason;
            await withdrawRecord.save();
        }

        await UserWalletEntity.createQueryBuilder()
            .update()
            .where('userId =: userId', { userId: withdrawRecord.user.id })
            .set({
                amount: () => `amount + ${withdrawRecord.amount}`,
            })
            .execute();

        this.eventEmitter.emit(
            'withdraw.auditFailed',
            new WithdrawAuditFailedEvent({
                applyId: withdrawRecord.id,
            }),
        );
    }
}
