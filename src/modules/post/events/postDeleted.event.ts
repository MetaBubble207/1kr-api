import { BaseEvent } from '@/modules/core/common/base.event';

export class PostDeletedEvent extends BaseEvent {
    postId: string;

    userId: string;
}
