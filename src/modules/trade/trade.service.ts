import { Injectable } from '@nestjs/common';

import { EventEmitter2 } from '@nestjs/event-emitter';

import { SocialCircleFeeEntity } from '../circle/entities';
import { UserEntity } from '../user/entities';

import { OrderEntity } from './entities';

import { PaidEvent } from './events/paid.event';
import { PayStatus, PayType } from './trade.constant';

@Injectable()
export class TradeService {
    constructor(protected readonly eventEmitter: EventEmitter2) {}

    /**
     * 获取加入圈子的支付二维码
     * @param user
     * @param fee
     * @param payType
     */
    async getJoinCirclePayQrcode(user: UserEntity, fee: SocialCircleFeeEntity, payType: PayType) {
        await OrderEntity.save({
            user,
            circle: fee.circle,
            amount: fee.amount,
            payType,
            status: PayStatus.ToBePaid,
            circleFee: {
                type: fee.type,
                amount: fee.amount,
            },
        });

        // todo 微信支付宝接口
        return true;
    }

    /**
     * 支付成功
     * @param order
     */
    async paySuccess(order: OrderEntity) {
        this.eventEmitter.emit(
            'order.paid',
            new PaidEvent({
                orderId: order.id,
            }),
        );
    }

    async transferToUserByWechat() {
        console.log('wechat');
    }

    async transferToUserByAli() {
        console.log('ali');
    }
}
