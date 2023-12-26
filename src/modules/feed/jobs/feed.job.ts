import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { isNil } from 'lodash';

import {
    FollowCircleEvent,
    UnFollowCircleEvent,
} from '@/modules/circle/events/follow.circle.event';
import { JOB_FEEDS } from '@/modules/core/constants/job.constant';
import { PostDeletedEvent } from '@/modules/post/events/postDeleted.event';
import { PostPublishedEvent } from '@/modules/post/events/postPublished.event';

import { FeedService } from '../feed.service';

@Processor({ name: JOB_FEEDS })
export class FeedJob {
    constructor(private readonly feedService: FeedService) {}

    @Process()
    async handle(job: Job<any>) {
        console.log(`消费：${job.id}, ${job.data.jobType}`);
        if (isNil(job.data.jobType)) {
            return;
        }
        switch (job.data.jobType) {
            case PostPublishedEvent.name:
                await this.feedService.postPublish(job.data.postId);
                break;
            case PostDeletedEvent.name:
                await this.feedService.postDelete(job.data.postId);
                break;
            case FollowCircleEvent.name:
                await this.feedService.userFollow(job.data.userId, job.data.targetUserId);
                break;
            case UnFollowCircleEvent.name:
                await this.feedService.userUnfollow(job.data.userId, job.data.targetUserId);
                break;
            default:
                break;
        }
    }
}
