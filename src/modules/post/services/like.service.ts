import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { isNil } from 'lodash';
import { In } from 'typeorm';

import { FollowService, MemberService } from '../../circle/services';
import { CommentEntity } from '../../comment/entities/comment.entity';
import { CommentLikeEntity } from '../../comment/entities/like.entity';
import { CancelCommentLikeEvent } from '../../comment/events/cancelCommentLike.event';
import { CommentLikeEvent } from '../../comment/events/commentLike.event';
import { UserEntity } from '../../user/entities/user.entity';
import { PostLikeEntity } from '../entities/like.entity';
import { PostEntity } from '../entities/post.entity';
import { CancelPostLikeEvent } from '../events/cancelPostLike.event';
import { PostLikeEvent } from '../events/postLike.event';
import { BUSINESS } from '../post.constant';

/**
 * 点赞
 */
@Injectable()
export class LikeService {
    constructor(
        protected readonly eventEmitter: EventEmitter2,
        protected readonly memberService: MemberService,
        protected readonly followService: FollowService,
    ) {}

    /**
     * 点赞
     * @param user 用户
     * @param postId 帖子ID
     */
    async like(user: UserEntity, postId: string): Promise<boolean> {
        const post = await PostEntity.findOne({
            where: { id: postId },
            relations: ['user', 'circle', 'section'],
        });
        if (isNil(post)) {
            return false;
        }

        switch (post.business) {
            case BUSINESS.CIRCLE_FORUM:
            case BUSINESS.CIRCLE_COURSE:
                if (!this.memberService.isMember(post.circle.id, user.id)) {
                    throw new BadRequestException('请先订阅该圈子');
                }
                break;
            case BUSINESS.CIRCLE_FEED:
                if (
                    !this.memberService.isMember(post.circle.id, user.id) ||
                    !this.followService.isFollowing(user.id, post.circle.id)
                ) {
                    throw new BadRequestException('请先关注或订阅该圈子');
                }
                break;
            default:
                break;
        }

        const result = await PostLikeEntity.createQueryBuilder()
            .insert()
            .orIgnore()
            .updateEntity(false)
            .values({
                user,
                post,
            })
            .execute();
        if (result.raw.affectedRows === 1) {
            this.eventEmitter.emit(
                'post.like',
                new PostLikeEvent({
                    userId: user.id,
                    postId,
                    targetUserId: post.user.id,
                }),
            );
            return true;
        }

        return false;
    }

    /**
     * 取消点赞
     */
    async cancelLike(user: UserEntity, postId: string) {
        const result = await PostLikeEntity.createQueryBuilder(PostLikeEntity.name)
            .where('userId = :userId AND postId = :postId', { userId: user.id, postId })
            .delete()
            .execute();
        if (result.affected === 1) {
            this.eventEmitter.emit(
                'post.cancelLike',
                new CancelPostLikeEvent({
                    userId: user.id,
                    postId,
                }),
            );
        }

        return result.affected === 1;
    }

    /**
     * 点赞
     * @param user 用户
     * @param commentId 帖子ID
     */
    async likeComment(user: UserEntity, comment: CommentEntity): Promise<boolean> {
        const result = await CommentLikeEntity.createQueryBuilder()
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
                'comment.like',
                new CommentLikeEvent({
                    postId: comment.post.id,
                    userId: user.id,
                    commentId: comment.id,
                    targetUserId: comment.user.id,
                }),
            );
        }

        return true;
    }

    /**
     * 取消点赞
     * @param userId 用户ID
     * @param commentId 帖子ID
     */
    async cancelLikeComment(userId: string, commentId: number) {
        const result = await CommentLikeEntity.createQueryBuilder(CommentLikeEntity.name)
            .where('userId = :userId AND commentId = :commentId', { userId, commentId })
            .delete()
            .execute();
        if (result.affected === 1) {
            this.eventEmitter.emit(
                'comment.cancelLike',
                new CancelCommentLikeEvent({
                    userId,
                    commentId,
                }),
            );
        }

        return true;
    }

    /**
     * 获取帖子点赞的用户列表
     * @param postId 帖子ID
     * @param page 页码
     * @param limit 数量
     */
    async getLikeUsers(postId: number, page = 1, limit = 10) {
        const postLikes = await PostLikeEntity.createQueryBuilder(PostLikeEntity.name)
            .where('postId = :postId', { postId })
            .select(['userId'])
            .orderBy('id', 'DESC')
            .offset((page - 1) * limit)
            .take(limit)
            .execute();
        if (isNil(postLikes)) {
            return [];
        }
        const userIds = postLikes.map((item: any) => {
            return item.userId;
        });
        return UserEntity.find({
            where: { id: In(userIds) },
            select: ['id', 'nickname', 'avatar'],
        });
    }

    /**
     * 获取用户的点赞帖子列表
     * @param userId 用户ID
     * @param page 页码
     * @param limit 数量
     */
    async getLikePosts(userId: number, page = 1, limit = 10) {
        const postLikes = await PostLikeEntity.createQueryBuilder(PostLikeEntity.name)
            .where('userId = :userId', { userId })
            .select(['postId'])
            .orderBy('id', 'DESC')
            .offset((page - 1) * limit)
            .take(limit)
            .execute();
        if (isNil(postLikes)) {
            return [];
        }
        const postIds = postLikes.map((item: any) => {
            return item.postId;
        });
        return PostEntity.find({
            where: { id: In(postIds) },
        });
    }

    async filterLikePostIds(userId: string, postIds: string[]): Promise<string[]> {
        return postIds.length > 0
            ? (
                  await PostLikeEntity.createQueryBuilder('post_like')
                      .select(['postId'])
                      .where('userId = :userId', { userId })
                      .andWhere('postId IN (:...postIds)', { postIds })
                      .getRawMany()
              ).map((v) => v.postId)
            : [];
    }

    async filterLikeCommentIds(userId: string, commentIds: number[]): Promise<number[]> {
        return commentIds.length > 0
            ? (
                  await CommentLikeEntity.createQueryBuilder('comment_like')
                      .select(['commentId'])
                      .where('userId = :userId', { userId })
                      .andWhere('commentId IN (:...commentIds)', { commentIds })
                      .getRawMany()
              ).map((v) => v.commentId)
            : [];
    }

    async getUserReceivedLikeCount(userId: number): Promise<number> {
        return PostLikeEntity.createQueryBuilder('post_like')
            .leftJoinAndSelect('post_like.post', 'post')
            .where('post.userId = :userId', { userId })
            .getCount();
    }
}
