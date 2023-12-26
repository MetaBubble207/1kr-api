import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { ObjectLiteral } from 'typeorm';

import { SocialCircleEntity } from '@/modules/circle/entities';

import { CollectEntity, CollectPostEntity } from '@/modules/collect/entities/collect.entity';
import { paginate, paginateWithData } from '@/modules/database/helpers';

import { FollowService, MemberService } from '../../circle/services';
import { SectionEntity } from '../../course/entities';
import { PaginateReturn } from '../../database/types';
import { UserEntity } from '../../user/entities/user.entity';
import { QueryPostCollectDto } from '../dtos/collect.dto';
import { CreateFeedDto, CreatePostDto, CreateQuestionDto } from '../dtos/create-post.dto';
import { QueryPostLikeDto } from '../dtos/like.dto';
import { QueryFeedDto, QueryPostDto, QueryQuestionDto } from '../dtos/post-query.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { PostLikeEntity } from '../entities/like.entity';
import { PostEntity } from '../entities/post.entity';
import { CancelPostCollectEvent } from '../events/cancelPostCollect.event';
import { PostCollectEvent } from '../events/postCollect.event';
import { PostPublishedEvent } from '../events/postPublished.event';

import { BUSINESS } from '../post.constant';

import { LikeService } from './like.service';

@Injectable()
export class PostService {
    constructor(
        protected readonly eventEmitter: EventEmitter2,
        protected readonly likeService: LikeService,
        protected readonly memberService: MemberService,
        protected readonly followService: FollowService,
    ) {}

    async create(
        data: CreatePostDto,
        user: UserEntity,
        circle: SocialCircleEntity,
    ): Promise<PostEntity>;

    async create(
        data: CreateFeedDto,
        user: UserEntity,
        circle: SocialCircleEntity,
    ): Promise<PostEntity>;

    async create(
        data: CreateQuestionDto,
        user: UserEntity,
        section: SectionEntity,
    ): Promise<PostEntity>;

    /**
     * 发布帖子、动态、问答
     * @param data
     * @param user
     * @param relation
     */
    async create(
        data: CreatePostDto | CreateFeedDto | CreateQuestionDto,
        user: UserEntity,
        relation: SocialCircleEntity | SectionEntity,
    ): Promise<PostEntity> {
        const post = await PostEntity.save({
            ...data,
            user,
            ...(relation instanceof SocialCircleEntity && { circle: relation }),
            ...(relation instanceof SectionEntity && { section: relation }),
            business: ((param) => {
                if (param instanceof CreatePostDto) {
                    return BUSINESS.CIRCLE_FORUM;
                }
                if (param instanceof CreateFeedDto) {
                    return BUSINESS.CIRCLE_FEED;
                }
                return BUSINESS.CIRCLE_COURSE;
            })(data),
        });

        this.eventEmitter.emit(
            'post.publish',
            new PostPublishedEvent({
                userId: user.id,
                postId: post.id,
            }),
        );

        return PostEntity.findOne({
            where: { id: post.id },
            relations: ['user', 'circle', 'section'],
        });
    }

    async list(user: UserEntity, options: QueryPostDto): Promise<PaginateReturn<PostEntity>>;

    async list(user: UserEntity, options: QueryFeedDto): Promise<PaginateReturn<PostEntity>>;

    async list(user: UserEntity, options: QueryQuestionDto): Promise<PaginateReturn<PostEntity>>;

    async list(
        user: UserEntity,
        options: QueryPostDto | QueryFeedDto | QueryQuestionDto,
    ): Promise<PaginateReturn<PostEntity>> {
        const { page, limit } = options;
        const query = PostEntity.createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .leftJoinAndSelect('post.circle', 'circle')
            .leftJoinAndSelect('post.section', 'section')
            .orderBy('post.createdAt', 'DESC')
            .offset((page - 1) * limit)
            .limit(limit);
        if (options instanceof QueryQuestionDto) {
            query.where('sction.id = :sctionId', { sctionId: options.sectionId });
        } else {
            query.where('circle.id = :circleId', { circleId: options.circleId });
        }
        const data = await query.getManyAndCount();
        return paginateWithData({ page, limit }, await this.renderPostInfo(data[0], user), data[1]);
    }

    async getPostLikes(options: QueryPostLikeDto, user: UserEntity) {
        const post = await PostEntity.findOneByOrFail({ id: options.postId });
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
        return paginate(
            PostLikeEntity.createQueryBuilder('like_post')
                .leftJoinAndSelect('like_post.user', 'user')
                .leftJoinAndSelect('like_post.post', 'post')
                .where('post.id = :postId', { postId: options.postId })
                .orderBy('like_post.id', 'DESC'),
            options,
        );
    }

    async getPostCollects(options: QueryPostCollectDto, user: UserEntity) {
        const post = await PostEntity.findOneByOrFail({ id: options.postId });
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
            throw new BadRequestException('帖子不存在');
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
        switch (post.business) {
            case BUSINESS.CIRCLE_FORUM:
            case BUSINESS.CIRCLE_COURSE:
                if (!this.memberService.isMember(post.circle.id, collect.user.id)) {
                    throw new BadRequestException('请先订阅该圈子');
                }
                break;
            case BUSINESS.CIRCLE_FEED:
                if (
                    !this.memberService.isMember(post.circle.id, collect.user.id) ||
                    !this.followService.isFollowing(collect.user.id, post.circle.id)
                ) {
                    throw new BadRequestException('请先关注或订阅该圈子');
                }
                break;
            default:
                break;
        }

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
