import { BadRequestException, Injectable } from "@nestjs/common";
import { UserEntity } from "../../user/entities";
import { CommentEntity, DownvoterEntity, UpvoterEntity } from "../entities";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { CancleUpvoteEvent, UpvoteEvent } from "../events/upvote.event";
import { CancleDownvoteEvent, DownvoteEvent } from "../events/downvote.event";
import { BUSINESS } from "../../post/post.constant";
import { BestAnswerEvent } from "../events/bestAnswer.event";
import { QueryVoterDto } from "../dto/vote.dto";
import { paginate } from "../../database/helpers";

@Injectable()
export class VoteService {
    constructor(protected readonly eventEmitter: EventEmitter2) {}

    /**
     * 赞同票
     */
    async upvote(user: UserEntity, comment: CommentEntity): Promise<boolean> {
        const result = await UpvoterEntity.createQueryBuilder()
            .insert()
            .orIgnore()
            .updateEntity(false)
            .values({
                user,
                comment,
            })
            .execute();
        if (result.raw.affectedRows === 1) {
            this.eventEmitter.emit(
                'comment.upvote',
                new UpvoteEvent({
                    userId: user.id,
                    commentId: comment.id,
                }),
            );
            return true;
        }

        return false;
    }

    /**
     * 取消赞成票
     */
    async cancelUpvote(user: UserEntity, comment: CommentEntity) {
        const result = await UpvoterEntity.createQueryBuilder()
            .where('userId = :userId AND commentId = :commentId', { userId: user.id, commentId: comment.id })
            .delete()
            .execute();
        if (result.affected === 1) {
            this.eventEmitter.emit(
                'comment.cancelUpvote',
                new CancleUpvoteEvent({
                    userId: user.id,
                    commentId: comment.id,
                }),
            );
            return true;
        }

        return false;
    }

    /**
     * 反对票
     */
    async downvote(user: UserEntity, comment: CommentEntity): Promise<boolean> {
        const result = await DownvoterEntity.createQueryBuilder()
            .insert()
            .orIgnore()
            .updateEntity(false)
            .values({
                user,
                comment,
            })
            .execute();
        if (result.raw.affectedRows === 1) {
            this.eventEmitter.emit(
                'comment.downvote',
                new DownvoteEvent({
                    userId: user.id,
                    commentId: comment.id,
                }),
            );
            return true;
        }

        return false;
    }

    /**
     * 取消反对票
     */
    async cancelDownvote(user: UserEntity, comment: CommentEntity) {
        const result = await DownvoterEntity.createQueryBuilder()
            .where('userId = :userId AND commentId = :commentId', { userId: user.id, commentId: comment.id })
            .delete()
            .execute();
        if (result.affected === 1) {
            this.eventEmitter.emit(
                'comment.cancelDownvote',
                new CancleDownvoteEvent({
                    userId: user.id,
                    commentId: comment.id,
                }),
            );
            return true;
        }

        return false;
    }

    /**
     * 最佳答案
     */
    async setBest(user: UserEntity, comment: CommentEntity): Promise<boolean> {
        if (comment.post.business !== BUSINESS.CIRCLE_COURSE) {
            throw new BadRequestException('非法请求');
        }
        const result = await CommentEntity.createQueryBuilder('comment')
            .leftJoinAndSelect('comment.post', 'post')
            .update(CommentEntity)
            .set({
                best: false,
            }).where("post.id = :postId", {postId: comment.post.id})
            .andWhere('comment.best = :best', {best: true})
            .execute();
        if (result.raw.affectedRows === 1) {
            this.eventEmitter.emit(
                'comment.best',
                new BestAnswerEvent({
                    commentId: comment.id,
                }),
            );
            return true;
        }

        return false;
    }

    /**
     * 获取赞成票用户列表
    */
     async getUpvoters(options: QueryVoterDto) {
        return paginate(
            UpvoterEntity.createQueryBuilder('upvoter')
                .leftJoinAndSelect('upvoter.user', 'user')
                .leftJoinAndSelect('upvoter.comment', 'comment')
                .where('comment.id = :commentId', { commentId: options.commentId })
                .orderBy('upvoter.id', 'DESC'), 
            options);
    }

    /**
     * 获取反对票用户列表
    */
    async getDownvoters(options: QueryVoterDto) {
        return paginate(
            DownvoterEntity.createQueryBuilder('downvoter')
                .leftJoinAndSelect('downvoter.user', 'user')
                .leftJoinAndSelect('downvoter.comment', 'comment')
                .where('comment.id = :commentId', { commentId: options.commentId })
                .orderBy('downvoter.id', 'DESC'), 
            options);
    }
}