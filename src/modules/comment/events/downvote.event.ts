import { BaseEvent } from "@/modules/core/common/base.event";

export class DownvoteEvent extends BaseEvent {
    commentId: string;

    userId: string;
}


export class CancleDownvoteEvent extends DownvoteEvent {}