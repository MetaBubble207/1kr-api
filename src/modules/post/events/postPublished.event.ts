import { BaseEvent } from '@/modules/core/common/base.event';

export class PostPublishedEvent extends BaseEvent {
    postId: string;

    userId: string;
}
