import { BaseEvent } from '@/modules/core/common/base.event';

export class PostCollectEvent extends BaseEvent {
    postId: string;

    collectId: string;

    userId: string;

    targetUserId: string;
}
