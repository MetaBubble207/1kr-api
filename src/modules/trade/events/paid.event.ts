import { BaseEvent } from '../../core/common/base.event';

export class PaidEvent extends BaseEvent {
    orderId: string;
}
