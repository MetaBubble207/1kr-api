import { BaseEvent } from "@/modules/core/common/base.event";

export class UpvoteEvent extends BaseEvent {
    commentId: string;

    userId: string;
}

export class CancleUpvoteEvent extends UpvoteEvent {}
