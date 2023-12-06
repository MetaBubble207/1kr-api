import { BaseEvent } from '@/modules/core/common/base.event';

export class CreateCircleEvent extends BaseEvent {
    circleId: string;

    userId: string;
}
