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

import { CancelPostCollectDto, PostCollectDto, QueryPostCollectDto } from './dto/collect.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { LikeDto, QueryPostLikeDto, UnlikeDto } from './dto/like.dto';
import { QueryPostDto } from './dto/post-query.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { PostDeletedEvent } from './events/postDeleted.event';
import { LikeService } from './services/like.service';
import { PostService } from './services/post.service';

@Controller('posts')
@ApiBearerAuth()
@ApiTags('帖子')
export class PostController {
    constructor(
        private readonly postService: PostService,
        private readonly likeService: LikeService,
        protected readonly eventEmitter: EventEmitter2,
    ) {}

    @Post()
    async create(@ReqUser() user: UserEntity, @Body() data: CreatePostDto) {
        const circle = await SocialCircleEntity.findOne({
            where: { id: data.circleId },
            relations: ['user'],
        });
        if (!circle || circle.user.id !== user.id) {
            throw new BadRequestException('圈子不存在');
        }
        await this.postService.create(data, user, circle);
    }

    @Get()
    async findAll(@ReqUser() user: UserEntity, @Query() pageDto: QueryPostDto) {
        await this.postService.list(user, pageDto);
    }

    @Post('like')
    async like(@Body() data: LikeDto, @ReqUser() user: UserEntity) {
        await this.likeService.like(user, data.postId);
    }

    @Post('cancelLike')
    async cancelLike(@Body() data: UnlikeDto, @ReqUser() user: UserEntity) {
        console.log(user);
        return this.likeService.cancelLike(user, data.postId);
    }

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

    @Get('likes')
    async likes(@Query() options: QueryPostLikeDto) {
        return this.postService.getPostLikes(options);
    }

    @Get('collects')
    async collects(@Query() options: QueryPostCollectDto) {
        this.postService.getPostCollects(options);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @ReqUser() user: UserEntity) {
        return this.postService.detail(id, user);
    }

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
