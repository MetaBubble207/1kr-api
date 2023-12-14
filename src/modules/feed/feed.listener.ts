import { OnEvent } from '@nestjs/event-emitter';
import { PostPublishedEvent } from '../post/events/postPublished.event';
import { PostDeletedEvent } from '../post/events/postDeleted.event';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { FollowCircleEvent, UnFollowCircleEvent } from '../circle/events/follow.circle.event';
import { BaseEvent } from '../core/common/base.event';

export class FeedListener {
    constructor(@InjectQueue('feeds') private feedQueue: Queue) {}

    @OnEvent('post.publish')
    handlePublishEvent(payload: PostPublishedEvent) {
        this.handle(payload);
    }

    @OnEvent('post.delete')
    handledeleteEvent(payload: PostDeletedEvent) {
        this.handle(payload);
    }

    @OnEvent('user.follow')
    handleFollowEvent(payload: FollowCircleEvent) {
        this.handle(payload);
    }

    @OnEvent('user.unfollow')
    handleUnfollowEvent(payload: UnFollowCircleEvent) {
        this.handle(payload);
    }

    private handle(event: BaseEvent) {
        this.feedQueue.add({ ...event, jobType: event.constructor.name });
    }
}
