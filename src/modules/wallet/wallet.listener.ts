import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { Logger } from 'winston';

import { OrderEntity } from '../trade/entities';
import { PaidEvent } from '../trade/events/paid.event';
import { UserEntity } from '../user/entities';
import { RegisteredEvent } from '../user/events/registered.event';

import {
    UserWalletEntity,
    UserWalletRechargeRecordEntity,
    UserWalletTransRecordEntity,
} from './entities';
import { JoinTradeSuccessEvent } from './events/JoinTradeSuccess.event';
import { RechargeStatus, TransType } from './wallet.constant';

@Injectable()
export class WalletListener {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    // 初始化用户钱包
    @OnEvent('user.registered')
    async handleUserregisteredEvent(payload: RegisteredEvent) {
        UserWalletEntity.createQueryBuilder('wallet')
            .insert()
            .orIgnore()
            .updateEntity(false)
            .values({
                user: await UserEntity.findOneBy({ id: payload.userId }),
            })
            .execute();
    }

    // 支付回调成功后的钱包账户变动
    @OnEvent('order.paid')
    async handleOrderPaidEvent(payload: PaidEvent) {
        console.log(`${payload.orderId} paid`);
        const order = await OrderEntity.findOne({
            where: { id: payload.orderId },
            relations: ['user', 'circle', 'circle.user'],
        });
        if (!order) {
            return;
        }

        const result = await UserWalletRechargeRecordEntity.createQueryBuilder('rechargeRecord')
            .insert()
            .orIgnore()
            .updateEntity(false)
            .values({
                user: order.user,
                amount: order.amount,
                status: RechargeStatus.Success,
            })
            .execute();
        if (result.raw.affectedRows === 0) {
            return;
        }

        const runner = UserWalletRechargeRecordEntity.getRepository().queryRunner;
        await runner.startTransaction();
        try {
            const wallet = await UserWalletEntity.createQueryBuilder('wallet')
                .where('userId = :userId', { userId: order.circle.user.id })
                .setLock('pessimistic_write')
                .getOneOrFail();
            const beforeBalance = wallet.amount;
            wallet.amount = beforeBalance + order.amount;
            await wallet.save();

            await UserWalletTransRecordEntity.save({
                user: order.circle.user,
                amount: order.amount,
                type: TransType.JoinCircleIncome,
                beforeBalance,
                afterBalance: wallet.amount,
            });

            await runner.commitTransaction();

            this.eventEmitter.emit(
                'wallet.joinTradeSuccess',
                new JoinTradeSuccessEvent({
                    orderId: order.id,
                }),
            );
        } catch (error) {
            this.logger.error(
                `handleOrderPaidEvent failed, orderId: ${order.id}, message: ${
                    (error as any).message
                }`,
            );
            await runner.rollbackTransaction();
        } finally {
            await runner.release();
        }
    }
}
