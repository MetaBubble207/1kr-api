import { BaseEvent } from '@/modules/core/common/base.event';

export class CommentCreateEvent extends BaseEvent {
    postId: string;

    commentId: number;

    rootCommentId: string;

    userId: string;

    targetUserId: string;
}
