import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Query,
    Req,
    BadRequestException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { isNil } from 'lodash';
import { ExtractJwt } from 'passport-jwt';

import { PostEntity } from '../post/entities/post.entity';

import { BUSINESS } from '../post/post.constant';
import { LikeService } from '../post/services';

import { Depends } from '../restful/decorators';
import { Guest, ReqUser } from '../user/decorators';
import { UserEntity } from '../user/entities/user.entity';

import { CommentModule } from './comment.module';
import { CreateCommentDto } from './dto/create-comment.dto';
import { LikeDto, UnlikeDto } from './dto/like.dto';
import { QueryChildrenCommentDto, QueryPostCommentDto } from './dto/query-comment.dto';
import { QueryVoterDto, UnvoteDto, VoteDto } from './dto/vote.dto';
import { CommentEntity } from './entities/comment.entity';
import { CommentService } from './services/comment.service';
import { VoteService } from './services/vote.service';

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
    @ApiOperation({ summary: '新增评论' })
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
    @ApiOperation({ summary: '获取评论列表' })
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
    @ApiOperation({ summary: '获取子评论列表' })
    async getChildren(@Query() queryDto: QueryChildrenCommentDto, @Req() request: any) {
        const parent = await CommentEntity.findOneBy({ id: queryDto.parent });
        if (isNil(parent)) {
            throw new BadRequestException('文章不存在');
        }
        const requestToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request) as string;
        const decodeToken = this.jwtService.decode(requestToken);
        return this.commentService.getChildrenComments(
            parent,
            (decodeToken as any)?.userId,
            queryDto.cursor || 0,
            queryDto.limit,
        );
    }

    @Post('like')
    @ApiOperation({ summary: '点赞评论' })
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
    @ApiOperation({ summary: '取消点赞评论' })
    async cancelLike(@Body() data: UnlikeDto, @ReqUser() user: UserEntity) {
        console.log(user);
        return this.likeService.cancelLikeComment(user.id, data.commentId);
    }

    @Post('upvote')
    @ApiOperation({ summary: '投赞成票' })
    async upvote(@Body() data: VoteDto, @ReqUser() user: UserEntity) {
        const comment = await CommentEntity.findOneOrFail({
            where: { id: data.commentId },
            relations: ['post'],
        });
        if (!comment || comment.post.business !== BUSINESS.CIRCLE_COURSE) {
            throw new BadRequestException('请传入合法的问答ID');
        }
        return this.voteService.upvote(user, comment);
    }

    @Post('cancelUpvote')
    @ApiOperation({ summary: '取消赞成票' })
    async cancelUpvote(@Body() data: UnvoteDto, @ReqUser() user: UserEntity) {
        console.log(user);
        return this.voteService.cancelUpvote(
            user,
            await CommentEntity.findOneOrFail({
                where: { id: data.commentId },
            }),
        );
    }

    @Post('downvote')
    @ApiOperation({ summary: '投反对票' })
    async downvote(@Body() data: VoteDto, @ReqUser() user: UserEntity) {
        const comment = await CommentEntity.findOneOrFail({
            where: { id: data.commentId },
            relations: ['post'],
        });
        if (!comment || comment.post.business !== BUSINESS.CIRCLE_COURSE) {
            throw new BadRequestException('请传入合法的问答ID');
        }
        return this.voteService.downvote(user, comment);
    }

    @Post('cancelDownvote')
    @ApiOperation({ summary: '取消反对票' })
    async cancelDownvote(@Body() data: UnvoteDto, @ReqUser() user: UserEntity) {
        return this.voteService.cancelDownvote(
            user,
            await CommentEntity.findOneOrFail({
                where: { id: data.commentId },
            }),
        );
    }

    @Post('setBest')
    @ApiOperation({ summary: '设置为最佳答案' })
    async setBest(@Body() data: VoteDto, @ReqUser() user: UserEntity) {
        const comment = await CommentEntity.findOneOrFail({
            where: { id: data.commentId },
            relations: ['post', 'post.user'],
        });
        if (
            !comment ||
            comment.post.business !== BUSINESS.CIRCLE_COURSE ||
            comment.post.user.id !== user.id
        ) {
            throw new BadRequestException('请传入合法的问答ID');
        }
        return this.voteService.setBest(user, comment);
    }

    @Get('upvoters')
    @ApiOperation({ summary: '投赞成票用户列表' })
    async getUpvoters(@Query() options: QueryVoterDto) {
        return this.voteService.getUpvoters(options);
    }

    @Get('downvoters')
    @ApiOperation({ summary: '投反对票用户列表' })
    async getDownvoters(@Query() options: QueryVoterDto) {
        return this.voteService.getDownvoters(options);
    }

    @Delete(':id')
    @ApiOperation({ summary: '删除评论' })
    async remove(@Param('id') id: number, @ReqUser() user: UserEntity) {
        const comment = await CommentEntity.findOne({ where: { id }, relations: ['user', 'post'] });
        if (isNil(comment) || comment.user.id !== user.userId) {
            return true;
        }
        return this.commentService.remove(comment);
    }
}
