import { BaseEvent } from '@/modules/core/common/base.event';

export class FollowCircleEvent extends BaseEvent {
    circleId: string;

    userId: string;
}

export class UnFollowCircleEvent extends FollowCircleEvent {}
