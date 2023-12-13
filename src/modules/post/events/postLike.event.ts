import { BaseEvent } from '@/modules/core/common/base.event';

export class PostLikeEvent extends BaseEvent {
    postId: string;

    userId: string;

    targetUserId: string;
}
