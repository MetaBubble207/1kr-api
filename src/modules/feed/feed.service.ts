import { Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { FeedEntity } from './entities/feed.entity';
import { PostEntity } from '../post/entities/post.entity';
import { PaginateDto } from '../restful/dtos';
import { paginateCursorWithData } from '../database/helpers';
import { FollowService } from '../circle/services';
import { BUSINESS } from '../post/post.constant';

/**
 * feed流
 */
@Injectable()
export class FeedService {
    constructor(
        private readonly followService: FollowService,
    ) {}

    /**
     * 关注feeds流
     * @param userId 用户ID
     * @param page 页码
     * @param limit 数量
     */
    async getTimelineFeeds(userId: number, options: PaginateDto) {
        const {limit, cursor} = options;
        const query = FeedEntity.createQueryBuilder()
            .where('user_id = :userId', { userId });
        if (cursor) {
            query.andWhere('id < :id', {id: cursor});
        }
        const feeds = await query.orderBy('publish_time', 'DESC').take(limit).getMany();
        if (feeds.length === 0) {
            return paginateCursorWithData({cursor: 0, limit}, []);
        }
        const postIds = feeds.map((item: FeedEntity) => {
            return item.postId;
        });
        const posts = await PostEntity.createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .leftJoinAndSelect('post.circle', 'circle')
            .where(`post.id IN(${postIds})`)
            .orderBy('post.createdAt', 'DESC')
            .getMany();
        return paginateCursorWithData({cursor: feeds.map(v => v.id).at(-1), limit}, posts);
    }

    /**
     * 用户关注后同步被关注者动态(限制最近20条)
     * @param userId 用户ID
     * @param circleId 圈子ID
     */
    async userFollow(userId: string, circleId: string, limit = 20) {
        const recentQuery = PostEntity.createQueryBuilder('post')
            .leftJoinAndSelect('post.circle', 'circle')
            .where('circle = :circleId', { circleId })
            .select(['post.id', 'post.createdAt'])
            .orderBy('post.createdAt', 'DESC')
            .take(limit);
        const recentPosts = await PostEntity.query(...recentQuery.getQueryAndParameters());
        if (recentPosts.length === 0) {
            return;
        }

        const insertData = recentPosts.map((item: PostEntity) => {
            return {
                postId: item.id,
                userId,
                circleId,
                publishTime: item.createdAt.getTime() / 1000,
            };
        });
        await FeedEntity.createQueryBuilder().insert().orIgnore().values(insertData).execute();
    }

    /**
     * 取消关注清除圈子所有动态
     * @param userId 用户ID
     * @param circleId
     */
    async userUnfollow(userId: string, circleId: string) {
        await FeedEntity.createQueryBuilder()
            .where('userId = :userId', { userId })
            .andWhere('circleId = :circleId', { circleId })
            .delete()
            .execute();
    }

    // 被关注者发帖分发动态
    async postPublish(postId: string) {
        const post = await PostEntity.findOne({ where: { id: postId }, relations: ['circle'] });
        if (isNil(post) || post.business !== BUSINESS.CIRCLE_FEED) {
            return;
        }
        for (let i = 1; ; i++) {
            const followers = await this.followService.getFollowers(post.circle, i, 500);
            if (followers.length === 0) {
                break;
            }
            const insertData = followers.map((follower) => {
                return {
                    postId: post.id,
                    userId: follower.follower.id,
                    circleId: follower.circle.id,
                    publishTime: post.createdAt.getTime() / 1000,
                };
            });
            await FeedEntity.createQueryBuilder().insert().orIgnore().values(insertData).execute();
        }
    }

    // 被关注者发帖删除动态
    async postDelete(postId: string) {
        await FeedEntity.createQueryBuilder()
            .where('postId = :postId', { postId })
            .delete()
            .execute();
    }
}
