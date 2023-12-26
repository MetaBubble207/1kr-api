import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    SerializeOptions,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { keyBy } from 'lodash';
import { In } from 'typeorm';

import { Depends } from '@/modules/restful/decorators';

import { PaginateDto } from '@/modules/restful/dtos';

import { Guest, ReqUser } from '@/modules/user/decorators';

import { UserEntity } from '@/modules/user/entities';

import { MessageEntity } from '@/modules/ws/entities/message.entity';

import { WsService } from '@/modules/ws/services/ws.service';

import { TradeService } from '../../trade/trade.service';
import { CircleModule } from '../circle.module';
import { QueryChatMessageDto } from '../dtos/chat.dto';
import {
    CreateCircleDto,
    FollowCircleDto,
    JoinCircleDto,
    PayQrcodeDto,
    QueryFollowerCircleDto,
    UnFollowCircleDto,
    UpdateCircleDto,
} from '../dtos/circle.dto';
import { QueryMemberDto } from '../dtos/member.dto';
import { SocialCircleEntity, SocialCircleFeeEntity, TagEntity } from '../entities';
import { FollowService } from '../services';
import { CircleService } from '../services/circle.service';
import { MemberService } from '../services/member.service';

@ApiBearerAuth()
@ApiTags('圈子')
@Depends(CircleModule)
@Controller('circles')
export class CircleController {
    constructor(
        protected service: CircleService,
        protected memberService: MemberService,
        protected wsService: WsService,
        protected followService: FollowService,
        protected tradeService: TradeService,
    ) {}

    @Guest()
    @ApiOperation({ summary: '圈子列表' })
    @Get()
    async list(@Query() options: PaginateDto) {
        return this.service.paginate(options);
    }

    /**
     * 新增圈子
     * @param data
     */
    @Post()
    @ApiOperation({ summary: '新增圈子' })
    @SerializeOptions({ groups: ['circle-detail'] })
    async store(@Body() data: CreateCircleDto, @ReqUser() user: UserEntity) {
        const circle = await this.service.createCircle(user, data);
        if (!circle) {
            throw new BadRequestException('圈子名称已被占用, 请更改后重试');
        }
        return circle;
    }

    /**
     * 加入(订阅)免费圈子
     * @param data
     */
    @Post('join')
    @ApiOperation({ summary: '加入(订阅)免费圈子' })
    async join(@Body() data: JoinCircleDto, @ReqUser() user: UserEntity) {
        const circle = await SocialCircleEntity.findOneByOrFail({ id: data.id });
        if (!circle.free) {
            throw new BadRequestException('请先付费订阅');
        }
        return this.memberService.join(user, circle);
    }

    /**
     * 退出(取消订阅)免费圈子
     * @param data
     */
    @Post('exit')
    @ApiOperation({ summary: '退出(取消订阅)免费圈子' })
    async exit(@Body() data: JoinCircleDto, @ReqUser() user: UserEntity) {
        const circle = await SocialCircleEntity.findOneByOrFail({ id: data.id });
        if (!circle.free) {
            throw new BadRequestException('付费圈子不支持取消订阅');
        }
        return this.memberService.exit(user, circle);
    }

    /**
     * 支付二维码
     * @param data
     */
    @Post('payQrcode')
    @ApiOperation({ summary: '获取支付二维码' })
    async payQrcode(@Body() data: PayQrcodeDto, @ReqUser() user: UserEntity) {
        const fee = await SocialCircleFeeEntity.findOne({
            where: {
                circle: {
                    id: data.id,
                },
                type: data.feeType,
            },
            relations: ['circle'],
        });
        if (!fee) {
            throw new BadRequestException('圈子不存在或未设置套餐价格');
        }
        return this.tradeService.getJoinCirclePayQrcode(user, fee, data.payType);
    }

    /**
     * 成员列表
     * @param options
     */
    @Get('members')
    @ApiOperation({ summary: '成员列表' })
    async members(@Query() options: QueryMemberDto) {
        const circle = await SocialCircleEntity.findOneByOrFail({ id: options.id });
        return this.memberService.list(circle, options);
    }

    /**
     * 关注圈子
     * @param data
     */
    @Post('follow')
    @ApiOperation({ summary: '关注圈子' })
    async follow(@Body() data: FollowCircleDto, @ReqUser() user: UserEntity) {
        console.log(user);
        const circle = await SocialCircleEntity.findOneByOrFail({ id: data.id });
        return this.followService.follow(user, circle);
    }

    /**
     * 取关圈子
     * @param data
     */
    @Post('unFollow')
    @ApiOperation({ summary: '取关圈子' })
    async unFollow(@Body() data: UnFollowCircleDto, @ReqUser() user: UserEntity) {
        const circle = await SocialCircleEntity.findOneByOrFail({ id: data.id });
        return this.followService.unFollow(user, circle);
    }

    /**
     * 粉丝列表
     * @param options
     */
    @Guest()
    @Get('followers')
    @ApiOperation({ summary: '粉丝列表' })
    async followers(@Query() options: QueryFollowerCircleDto) {
        const circle = await SocialCircleEntity.findOneByOrFail({ id: options.id });
        return this.memberService.list(circle, options);
    }

    /**
     * 聊天消息列表
     * @param options
     */
    @SerializeOptions({ groups: ['chats'] })
    @Get('chats')
    @ApiOperation({ summary: '聊天消息列表' })
    async chats(@Query() options: QueryChatMessageDto, @ReqUser() user: UserEntity) {
        if (!this.memberService.isMember(options.circleId, user.id)) {
            throw new BadRequestException('请先订阅圈子');
        }
        const query = MessageEntity.createQueryBuilder().where('circleId = :circleId', {
            circleId: options.circleId,
        });
        if (options.cursor > 0) {
            query.andWhere('id < :cursor', { cursor: options.cursor });
        }
        const messages = await query
            .orderBy('sendTime', 'DESC')
            .limit(options.limit || 10)
            .getMany();
        if (messages.length === 0) {
            return {
                items: [],
                meta: {
                    perPage: options.limit || 10,
                },
            };
        }

        const userIds = messages.map((v) => v.userId);
        const users = keyBy(await UserEntity.findBy({ id: In(userIds) }), 'id');
        return {
            items: messages.map((v) => {
                v.user = users[v.userId];
                return v;
            }),
            meta: {
                perPage: options.limit || 10,
            },
        };
    }

    /**
     * 圈子详情
     * @param id
     */
    @Get(':id')
    @ApiOperation({ summary: '圈子详情' })
    @SerializeOptions({ groups: ['circle-detail'] })
    async detail(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        const circle = await this.service.detail(id);
        circle.onlineMemberCount = await this.wsService.getOnlineMemberCount(id);
        circle.tagList = await TagEntity.find({
            where: { circles: { circle: { id: circle.id } } },
            relations: ['circles'],
        });
        return circle;
    }

    /**
     * 更新圈子信息
     * @param data
     */
    @Patch(':id')
    @ApiOperation({ summary: '更新圈子信息' })
    @SerializeOptions({ groups: ['circle-detail'] })
    async update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() data: UpdateCircleDto,
        @ReqUser() user: UserEntity,
    ) {
        const circle = await SocialCircleEntity.findOne({ where: { id }, relations: ['user'] });
        if (!circle || circle.user.id !== user.id) {
            throw new Error('圈子不存在');
        }

        this.service.updateCircle(circle, data);
        return true;
    }
}
