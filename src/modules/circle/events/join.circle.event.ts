import { BaseEvent } from '@/modules/core/common/base.event';

export class JoinCircleEvent extends BaseEvent {
    circleId: string;

    userId: string;

    free = true;

    expiredTime?: number;
}
