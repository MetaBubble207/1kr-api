import { BaseEvent } from "@/modules/core/common/base.event";

export class CancelCommentLikeEvent extends BaseEvent {
    commentId: string;

    userId: string;
}
