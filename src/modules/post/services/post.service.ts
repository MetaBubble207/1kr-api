import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { ObjectLiteral } from 'typeorm';

import { SocialCircleEntity } from '@/modules/circle/entities';

import { CollectEntity, CollectPostEntity } from '@/modules/collect/entities/collect.entity';
import { paginate, paginateWithData } from '@/modules/database/helpers';

import { UserEntity } from '../../user/entities/user.entity';
import { QueryPostCollectDto } from '../dto/collect.dto';
import { CreatePostDto } from '../dto/create-post.dto';
import { QueryPostLikeDto } from '../dto/like.dto';
import { QueryPostDto } from '../dto/post-query.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostLikeEntity } from '../entities/like.entity';
import { PostEntity } from '../entities/post.entity';
import { CancelPostCollectEvent } from '../events/cancelPostCollect.event';
import { PostCollectEvent } from '../events/postCollect.event';
import { PostPublishedEvent } from '../events/postPublished.event';

import { LikeService } from './like.service';

@Injectable()
export class PostService {
    constructor(
        protected readonly eventEmitter: EventEmitter2,
        protected readonly likeService: LikeService,
    ) {}

    async create(data: CreatePostDto, user: UserEntity, circle: SocialCircleEntity) {
        const post = await PostEntity.save({
            ...data,
            user,
            circle,
        });

        this.eventEmitter.emit(
            'post.publish',
            new PostPublishedEvent({
                userId: user.id,
                postId: post.id,
            }),
        );

        return PostEntity.findOne({ where: { id: post.id }, relations: ['user', 'circle'] });
    }

    async list(user: UserEntity, options: QueryPostDto) {
        const { page, limit } = options;
        const query = PostEntity.createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .leftJoinAndSelect('post.circle', 'circle')
            .where('circle.id = :circleId', { circleId: options.circleId })
            .orderBy('post.createdAt', 'DESC')
            .offset((page - 1) * limit)
            .limit(limit);
        const data = await query.getManyAndCount();
        return paginateWithData({ page, limit }, await this.renderPostInfo(data[0], user), data[1]);
    }

    async getPostLikes(options: QueryPostLikeDto) {
        return paginate(
            PostLikeEntity.createQueryBuilder('like_post')
                .leftJoinAndSelect('like_post.user', 'user')
                .leftJoinAndSelect('like_post.post', 'post')
                .where('post.id = :postId', { postId: options.postId })
                .orderBy('like_post.id', 'DESC'),
            options,
        );
    }

    async getPostCollects(options: QueryPostCollectDto) {
        return paginate(
            CollectPostEntity.createQueryBuilder('collect_post')
                .leftJoinAndSelect('collect_post.collect', 'collect')
                .leftJoinAndSelect('collect_post.post', 'post')
                .leftJoinAndSelect('collect.user', 'user')
                .where('post.id = :postId', { postId: options.postId })
                .orderBy('collect_post.id', 'DESC'),
            options,
        );
    }

    async detail(id: string, user: UserEntity) {
        const post = await PostEntity.findOne({
            where: { id },
            relations: ['user', 'circle'],
        });
        if (!post) {
            throw new BadRequestException('文章不存在');
        }
        return (await this.renderPostInfo([post], user))[0];
    }

    async update(post: PostEntity, updatePostDto: UpdatePostDto) {
        return PostEntity.createQueryBuilder()
            .update()
            .where('id = :id', { id: post.id })
            .set(updatePostDto)
            .execute();
    }

    async collect(post: PostEntity, collect: CollectEntity, remark = '') {
        const result = await CollectPostEntity.createQueryBuilder()
            .insert()
            .orIgnore()
            .updateEntity(false)
            .values({
                collect,
                post,
                remark,
            })
            .execute();
        if (result.raw.affectedRows === 1) {
            this.eventEmitter.emit(
                'post.collect',
                new PostCollectEvent({
                    postId: post.id,
                    collectId: collect.id,
                    userId: collect.user.id,
                    targetUserId: post.user.id,
                }),
            );
        }
    }

    async cancleCollect(post: PostEntity, collect: CollectEntity) {
        const result = await CollectPostEntity.createQueryBuilder()
            .delete()
            .where({
                collect,
                post,
            })
            .execute();
        if (result.affected === 1) {
            this.eventEmitter.emit(
                'post.cancelCollect',
                new CancelPostCollectEvent({
                    postId: post.id,
                    collectId: collect.id,
                }),
            );
        }
    }

    async renderPostInfo<T extends ObjectLiteral & { post: PostEntity }>(
        posts: T[],
        user: UserEntity,
    ): Promise<T[]>;

    async renderPostInfo<PostEntity>(posts: PostEntity[], user: UserEntity): Promise<PostEntity[]>;

    async renderPostInfo<T extends (ObjectLiteral & { post: PostEntity }) | PostEntity>(
        posts: T[],
        user: UserEntity,
    ): Promise<T[]> {
        const userLikedPostIds = await this.likeService.filterLikePostIds(
            user.id,
            posts.map((v: T) => {
                if (v instanceof PostEntity) {
                    return v.id;
                }
                return v.post.id;
            }),
        );
        return posts.map((v: T) => {
            const interactionInfo = {
                liked: userLikedPostIds.includes(v.id),
                likeCount: v.likeCount,
                commentCount: v.commentCount,
                repostCount: v.repostCount,
                collectCount: v.collectCount,
            };
            if (v instanceof PostEntity) {
                v.interactionInfo = interactionInfo;
            } else {
                v.post.interactionInfo = interactionInfo;
            }
            return v;
        });
    }
}
