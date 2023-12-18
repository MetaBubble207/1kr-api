import { OnEvent } from '@nestjs/event-emitter';
import { CommentLikeEvent } from './events/commentLike.event';
import { CommentEntity } from './entities/comment.entity';
import { CancelCommentLikeEvent } from './events/cancelCommentLike.event';
import { CommentCreateEvent } from './events/create.event';
import { CommentDeleteEvent } from './events/delete.event';
import { CancleUpvoteEvent, UpvoteEvent } from './events/upvote.event';
import { CancleDownvoteEvent, DownvoteEvent } from './events/downvote.event';

export class CommentListener {
    @OnEvent('comment.create')
    async handleCommentCreateEvent(payload: CommentCreateEvent) {
        console.log(`comment ${payload.commentId} created`);
        payload.rootCommentId &&
            CommentEntity.createQueryBuilder(CommentEntity.name)
                .where('id = :id', { id: payload.rootCommentId })
                .update({
                    replyCount: () => 'replyCount + 1',
                })
                .execute();
    }

    @OnEvent('comment.delete')
    async handleCommentDeleteEvent(payload: CommentDeleteEvent) {
        console.log(`comment ${payload.commentId} deleted`);
        payload.rootCommentId &&
            CommentEntity.createQueryBuilder(CommentEntity.name)
                .where('id = :id', { id: payload.rootCommentId })
                .andWhere('replyCount > :replyCount', { replyCount: 0 })
                .update({
                    replyCount: () => 'replyCount - 1',
                })
                .execute();
    }

    @OnEvent('comment.like')
    async handleCommentLikeEvent(payload: CommentLikeEvent) {
        console.log(`comment ${payload.commentId} like`);
        await CommentEntity.createQueryBuilder(CommentEntity.name)
            .where('id = :id', { id: payload.commentId })
            .update(CommentEntity)
            .set({
                likeCount: () => 'likeCount + 1',
            })
            .execute();
    }

    @OnEvent('comment.cancelLike')
    async handleCommentCancelLikeEvent(payload: CancelCommentLikeEvent) {
        console.log(`comment ${payload.commentId} cancelLike`);
        await CommentEntity.createQueryBuilder(CommentEntity.name)
            .where('id = :id', { id: payload.commentId })
            .andWhere('likeCount > :count', { count: 0 })
            .update(CommentEntity)
            .set({
                likeCount: () => 'likeCount - 1',
            })
            .execute();
    }

    @OnEvent('comment.upvote')
    async handleUpvoteEvent(payload: UpvoteEvent) {
        console.log(`comment ${payload.commentId} like`);
        await CommentEntity.createQueryBuilder(CommentEntity.name)
            .where('id = :id', { id: payload.commentId })
            .update(CommentEntity)
            .set({
                upvoteCount: () => 'upvoteCount + 1',
            })
            .execute();
    }

    @OnEvent('comment.cancleUpvote')
    async handleCancleUpvoteEvent(payload: CancleUpvoteEvent) {
        console.log(`comment ${payload.commentId} like`);
        await CommentEntity.createQueryBuilder(CommentEntity.name)
            .where('id = :id', { id: payload.commentId })
            .andWhere('upvoteCount > :count', { count: 0 })
            .update(CommentEntity)
            .set({
                upvoteCount: () => 'upvoteCount - 1',
            })
            .execute();
    }

    @OnEvent('comment.downvote')
    async handleDownvoteEvent(payload: DownvoteEvent) {
        console.log(`comment ${payload.commentId} like`);
        await CommentEntity.createQueryBuilder(CommentEntity.name)
            .where('id = :id', { id: payload.commentId })
            .update(CommentEntity)
            .set({
                downvoteCount: () => 'downvoteCount + 1',
            })
            .execute();
    }

    @OnEvent('comment.cancleDownvote')
    async handleCancleDownvoteEvent(payload: CancleDownvoteEvent) {
        console.log(`comment ${payload.commentId} like`);
        await CommentEntity.createQueryBuilder(CommentEntity.name)
            .where('id = :id', { id: payload.commentId })
            .andWhere('downvoteCount > :count', { count: 0 })
            .update(CommentEntity)
            .set({
                downvoteCount: () => 'downvoteCount - 1',
            })
            .execute();
    }
}
