import { BaseEvent } from '@/modules/core/common/base.event';

export class JoinTradeSuccessEvent extends BaseEvent {
    orderId: string;
}
