import { BaseEvent } from '@/modules/core/common/base.event';

export class CommentDeleteEvent extends BaseEvent {
    postId: string;

    commentId: string;

    rootCommentId: string;
}
