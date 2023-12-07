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

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Depends } from '@/modules/restful/decorators';

import { PaginateDto } from '@/modules/restful/dtos';

import { Guest, ReqUser } from '@/modules/user/decorators';

import { UserEntity } from '@/modules/user/entities';

import { CircleModule } from '../circle.module';
import {
    CreateCircleDto,
    FollowCircleDto,
    JoinCircleDto,
    QueryFollowerCircleDto,
    UnFollowCircleDto,
    UpdateCircleDto,
} from '../dtos/circle.dto';
import { QueryMemberDto } from '../dtos/member.dto';
import { SocialCircleEntity } from '../entities';
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
    ) {}

    @Guest()
    @Get()
    async list(@Query() options: PaginateDto) {
        return this.service.paginate(options);
    }

    /**
     * 新增圈子
     * @param data
     */
    @Post()
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
    async exit(@Body() data: JoinCircleDto, @ReqUser() user: UserEntity) {
        const circle = await SocialCircleEntity.findOneByOrFail({ id: data.id });
        if (!circle.free) {
            throw new BadRequestException('付费圈子不支持取消订阅');
        }
        return this.memberService.exit(user, circle);
    }

    @Guest()
    @Get('members')
    async members(@Query() options: QueryMemberDto) {
        const circle = await SocialCircleEntity.findOneByOrFail({ id: options.id });
        return this.memberService.list(circle, options);
    }

    /**
     * 关注圈子
     * @param data
     */
    @Post('follow')
    async follow(@Body() data: FollowCircleDto, @ReqUser() user: UserEntity) {
        const circle = await SocialCircleEntity.findOneByOrFail({ id: data.id });
        return this.memberService.join(user, circle);
    }

    /**
     * 取关圈子
     * @param data
     */
    @Post('unFollow')
    async unFollow(@Body() data: UnFollowCircleDto, @ReqUser() user: UserEntity) {
        const circle = await SocialCircleEntity.findOneByOrFail({ id: data.id });
        return this.memberService.exit(user, circle);
    }

    /**
     * 圈子粉丝列表
     * @param options
     */
    @Guest()
    @Get('followers')
    async followers(@Query() options: QueryFollowerCircleDto) {
        const circle = await SocialCircleEntity.findOneByOrFail({ id: options.id });
        return this.memberService.list(circle, options);
    }

    /**
     * 圈子详情
     * @param id
     */
    @Get(':id')
    @SerializeOptions({ groups: ['circle-detail'] })
    async detail(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.service.detail(id);
    }

    /**
     * 更新圈子信息
     * @param data
     */
    @Patch(':id')
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
