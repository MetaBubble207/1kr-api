import { BaseEvent } from '@/modules/core/common/base.event';

export class ExitCircleEvent extends BaseEvent {
    circleId: string;

    userId: string;
}
