import { BaseEvent } from '@/modules/core/common/base.event';

export class CancelPostLikeEvent extends BaseEvent {
    postId: string;

    userId: string;
}
