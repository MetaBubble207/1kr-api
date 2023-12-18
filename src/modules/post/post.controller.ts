import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    BadRequestException,
} from '@nestjs/common';

import { EventEmitter2 } from '@nestjs/event-emitter';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { isNil } from 'lodash';

import { SocialCircleEntity } from '../circle/entities';
import { CollectEntity } from '../collect/entities/collect.entity';

import { ReqUser } from '../user/decorators';
import { UserEntity } from '../user/entities/user.entity';

import { CancelPostCollectDto, PostCollectDto, QueryPostCollectDto } from './dtos/collect.dto';
import { CreateFeedDto, CreatePostDto, CreateQuestionDto } from './dtos/create-post.dto';
import { LikeDto, QueryPostLikeDto, UnlikeDto } from './dtos/like.dto';
import { QueryFeedDto, QueryPostDto, QueryQuestionDto } from './dtos/post-query.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { PostDeletedEvent } from './events/postDeleted.event';
import { LikeService } from './services/like.service';
import { PostService } from './services/post.service';
import { Depends } from '../restful/decorators';
import { PostModule } from './post.module';
import { MemberService } from '../circle/services';
import { SectionEntity } from '../course/entities';

@Controller('posts')
@ApiBearerAuth()
@Depends(PostModule)
@ApiTags('帖子')
export class PostController {
    constructor(
        private readonly postService: PostService,
        private readonly likeService: LikeService,
        private readonly memberService: MemberService,
        protected readonly eventEmitter: EventEmitter2,
    ) {}

    /**
     * 发表圈子论坛贴
     * @param user 
     * @param data 
     */
    @Post()
    async create(@ReqUser() user: UserEntity, @Body() data: CreatePostDto) {
        const circle = await SocialCircleEntity.findOne({
            where: { id: data.circleId },
            relations: ['user'],
        });
        if (!circle || circle.user.id !== user.id || !this.memberService.isMember(circle.id, user.id)) {
            throw new BadRequestException('圈子不存在');
        }
        await this.postService.create(data, user, circle);
    }

    /**
     * 圈主发表动态
     * @param user 
     * @param data 
     */
    @Post('feeds')
    async createFeed(@ReqUser() user: UserEntity, @Body() data: CreateFeedDto) {
        const circle = await SocialCircleEntity.findOne({
            where: { id: data.circleId },
            relations: ['user'],
        });
        if (!circle || circle.user.id !== user.id) {
            throw new BadRequestException('圈子不存在');
        }
        await this.postService.create(data, user, circle);
    }

    /**
     * 发表问答帖
     * @param user 
     * @param data 
     */
    @Post('questions')
    async createQuestion(@ReqUser() user: UserEntity, @Body() data: CreateQuestionDto) {
        const section = await SectionEntity.findOne({
            where: { id: data.sectionId },
            relations: ['chapter.course.circle'],
        });
        if (!section || !section.chapter.course.qa || !this.memberService.isMember(section.chapter.course.circle.id, user.id)) {
            throw new BadRequestException('圈子不存在或未打开问答系统');
        }
        await this.postService.create(data, user, section);
    }

    /**
     * 分页获取圈子论坛帖子
     * @param user 
     * @param pageDto 
     */
    @Get()
    async findAll(@ReqUser() user: UserEntity, @Query() pageDto: QueryPostDto) {
        await this.postService.list(user, pageDto);
    }

    /**
     * 分页获取圈主动态
     * @param user 
     * @param pageDto 
     */
    @Get('feeds')
    async findAllFeeds(@ReqUser() user: UserEntity, @Query() pageDto: QueryFeedDto) {
        await this.postService.list(user, pageDto);
    }

    /**
     * 分页获取问答帖
     * @param user 
     * @param pageDto 
     */
    @Get('questions')
    async findAllQuestions(@ReqUser() user: UserEntity, @Query() pageDto: QueryQuestionDto) {
        await this.postService.list(user, pageDto);
    }

    /**
     * 点赞
     * @param data 
     * @param user 
     */
    @Post('like')
    async like(@Body() data: LikeDto, @ReqUser() user: UserEntity) {
        await this.likeService.like(user, data.postId);
    }

    /**
     * 取消点赞
     * @param data 
     * @param user 
     */
    @Post('cancelLike')
    async cancelLike(@Body() data: UnlikeDto, @ReqUser() user: UserEntity) {
        return this.likeService.cancelLike(user, data.postId);
    }

    /**
     * 收藏
     * @param data 
     * @param user 
     */
    @Post('collect')
    async collect(@Body() data: PostCollectDto, @ReqUser() user: UserEntity) {
        // 前期使用默认收藏夹
        const collect = data.collectId
            ? await CollectEntity.findOne({
                  where: { id: data.collectId },
                  relations: ['user'],
              })
            : await CollectEntity.findOne({
                  where: { user: { id: user.id } },
                  relations: ['user'],
                  order: { createdAt: 'DESC' },
              });
        if (!collect || collect.user.id !== user.userId) {
            throw new BadRequestException('收藏夹不存在');
        }
        const post = await PostEntity.findOne({ where: { id: data.postId }, relations: ['user'] });
        if (isNil(post)) {
            throw new BadRequestException('文章不存在');
        }
        return this.postService.collect(post, collect, data.remark);
    }

    /**
     * 取消收藏
     * @param data 
     * @param user 
     */
    @Post('cancelCollect')
    async cancelCollect(@Body() data: CancelPostCollectDto, @ReqUser() user: UserEntity) {
        const collect = await CollectEntity.findOne({
            where: { id: data.collectId },
            relations: ['user'],
        });
        if (isNil(collect) || collect.user.id !== user.userId) {
            throw new BadRequestException('收藏夹不存在');
        }
        const post = await PostEntity.findOneBy({ id: data.postId });
        if (isNil(post)) {
            throw new BadRequestException('文章不存在');
        }
        this.postService.cancleCollect(post, collect);
    }

    /**
     * 获取点赞用户列表
     * @param options 
     */
    @Get('likes')
    async likes(@Query() options: QueryPostLikeDto, @ReqUser() user: UserEntity) {
        return this.postService.getPostLikes(options, user);
    }

    /**
     * 获取收藏用户列表
     * @param options 
     */
    @Get('collects')
    async collects(@Query() options: QueryPostCollectDto, @ReqUser() user: UserEntity) {
        this.postService.getPostCollects(options, user);
    }

    /**
     * 获取帖子详情
     * @param id 
     * @param user 
     */
    @Get(':id')
    async findOne(@Param('id') id: string, @ReqUser() user: UserEntity) {
        return this.postService.detail(id, user);
    }

    /**
     * 更新帖子
     * @param id 
     * @param updatePostDto 
     * @param user 
     */
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updatePostDto: UpdatePostDto,
        @ReqUser() user: UserEntity,
    ) {
        const post = await PostEntity.findOne({ where: { id }, relations: ['user'] });
        if (isNil(post) || post.user.id !== user.userId) {
            throw new BadRequestException('文章不存在');
        }
        return this.postService.update(post, updatePostDto);
    }

    /**
     * 删除帖子
     * @param id 
     * @param user 
     */
    @Delete(':id')
    async remove(@Param('id') id: string, @ReqUser() user: UserEntity) {
        const post = await PostEntity.findOne({ where: { id }, relations: ['user'] });
        if (isNil(post) || post.user.id !== user.userId) {
            throw new BadRequestException('数据不合法');
        }
        post.softRemove();
        this.eventEmitter.emit(
            'post.delete',
            new PostDeletedEvent({
                userId: user.userId,
                postId: post.id,
            }),
        );
    }
}
