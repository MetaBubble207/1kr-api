import { BaseEvent } from '@/modules/core/common/base.event';

export class CancelPostCollectEvent extends BaseEvent {
    postId: string;

    collectId: string;
}
