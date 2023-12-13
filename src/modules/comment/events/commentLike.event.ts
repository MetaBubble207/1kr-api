import { BaseEvent } from "@/modules/core/common/base.event";

export class CommentLikeEvent extends BaseEvent {
    postId: string;

    commentId: string;

    userId: string;

    targetUserId: string;
}
