import { Controller, Get, Post, Body, Param, Delete, Query, Req, BadRequestException } from '@nestjs/common';
import { CommentService } from './services/comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserEntity } from '../user/entities/user.entity';
import { CommentEntity } from './entities/comment.entity';
import { isNil } from 'lodash';
import { PostEntity } from '../post/entities/post.entity';
import { QueryChildrenCommentDto, QueryPostCommentDto } from './dto/query-comment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LikeDto, UnlikeDto } from './dto/like.dto';
import { ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { LikeService } from '../post/services';
import { Guest, ReqUser } from '../user/decorators';
import { VoteService } from './services/vote.service';
import { BUSINESS } from '../post/post.constant';
import { QueryVoterDto, UnvoteDto, VoteDto } from './dto/vote.dto';
import { Depends } from '../restful/decorators';
import { CommentModule } from './comment.module';

@ApiBearerAuth()
@ApiTags('评论')
@Depends(CommentModule)
@Controller('comments')
export class CommentController {
    constructor(
        private readonly commentService: CommentService,
        private readonly likeService: LikeService,
        private readonly jwtService: JwtService,
        private readonly voteService: VoteService,
    ) {}

    @Post()
    async create(@Body() createCommentDto: CreateCommentDto, @ReqUser() user: UserEntity) {
        const post = await PostEntity.findOne({
            where: { id: createCommentDto.postId },
            relations: ['user'],
        });
        if (isNil(post)) {
            throw new BadRequestException('文章不存在');
        }
        const parent = createCommentDto.parent
            ? await CommentEntity.findOne({
                  where: { id: createCommentDto.parent },
                  relations: ['user'],
              })
            : null;
        const comment = await this.commentService.create(
            await UserEntity.findOneBy({ id: user.userId }),
            post,
            createCommentDto.content,
            parent,
        );
        return (await this.commentService.renderCommentInfo([comment], user.userId))[0];
    }

    @Get()
    @Guest()
    async findAll(@Query() queryDto: QueryPostCommentDto, @Req() request: any) {
        const post = await PostEntity.findOneBy({ id: queryDto.postId });
        if (isNil(post)) {
            throw new BadRequestException('文章不存在');
        }

        const requestToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request) as string;
        const decodeToken = this.jwtService.decode(requestToken);
        return this.commentService.getPostComments(
                post,
                (decodeToken as any)?.userId,
                queryDto.cursor || 0,
                queryDto.limit,
            );
    }

    @Get('children')
    @Guest()
    async getChildren(@Query() queryDto: QueryChildrenCommentDto, @Req() request: any) {
        const parent = await CommentEntity.findOneBy({ id: queryDto.parent });
        if (isNil(parent)) {
            throw new BadRequestException('文章不存在');
        }
        const requestToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request) as string;
        const decodeToken = this.jwtService.decode(requestToken);
        return await this.commentService.getChildrenComments(
                parent,
                (decodeToken as any)?.userId,
                queryDto.cursor || 0,
                queryDto.limit,
            );
    }

    @Post('like')
    async like(@Body() data: LikeDto, @ReqUser() user: UserEntity) {
        return this.likeService.likeComment(
                user,
                await CommentEntity.findOneOrFail({
                    where: { id: data.commentId },
                    relations: ['user', 'post'],
                }),
            );
    }

    @Post('cancelLike')
    async cancelLike(@Body() data: UnlikeDto, @ReqUser() user: UserEntity) {
        console.log(user);
        return await this.likeService.cancelLikeComment(user.id, data.commentId);
    }

    @Post('upvote')
    async upvote(@Body() data: VoteDto, @ReqUser() user: UserEntity) {
        const comment = await CommentEntity.findOneOrFail({
            where: { id: data.commentId },
            relations: ['post'],
        });
        if (!comment || comment.post.business !== BUSINESS.CIRCLE_COURSE) {
            throw new BadRequestException('请传入合法的问答ID');
        }
        return this.voteService.upvote(
                user,
                comment
            );
    }

    @Post('cancelUpvote')
    async cancelUpvote(@Body() data: UnvoteDto, @ReqUser() user: UserEntity) {
        console.log(user);
        return await this.voteService.cancelUpvote(user, await CommentEntity.findOneOrFail({
            where: { id: data.commentId },
        }),);
    }

    @Post('downvote')
    async downvote(@Body() data: VoteDto, @ReqUser() user: UserEntity) {
        const comment = await CommentEntity.findOneOrFail({
            where: { id: data.commentId },
            relations: ['post'],
        });
        if (!comment || comment.post.business !== BUSINESS.CIRCLE_COURSE) {
            throw new BadRequestException('请传入合法的问答ID');
        }
        return this.voteService.downvote(
                user,
                comment
            );
    }

    @Post('cancelDownvote')
    async cancelDownvote(@Body() data: UnvoteDto, @ReqUser() user: UserEntity) {
        return await this.voteService.cancelDownvote(user, await CommentEntity.findOneOrFail({
            where: { id: data.commentId },
        }),);
    }

    @Post('setBest')
    async setBest(@Body() data: VoteDto, @ReqUser() user: UserEntity) {
        const comment = await CommentEntity.findOneOrFail({
            where: { id: data.commentId },
            relations: ['post', 'post.user'],
        });
        if (!comment || comment.post.business !== BUSINESS.CIRCLE_COURSE || comment.post.user.id !== user.id) {
            throw new BadRequestException('请传入合法的问答ID');
        }
        return this.voteService.setBest(
                user,
                comment
            );
    }

    @Get('upvoters')
    async getUpvoters(@Query() options: QueryVoterDto) {
        return this.voteService.getUpvoters(options);
    }

    @Get('downvoters')
    async getDownvoters(@Query() options: QueryVoterDto) {
        return this.voteService.getDownvoters(options);
    }

    @Delete(':id')
    async remove(@Param('id') id: number, @ReqUser() user: UserEntity) {
        const comment = await CommentEntity.findOne({ where: { id }, relations: ['user', 'post'] });
        if (isNil(comment) || comment.user.id !== user.userId) {
            return true;
        }
        return this.commentService.remove(comment);
    }
}
