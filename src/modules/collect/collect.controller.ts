import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Query,
    BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { isNil } from 'lodash';

import { PaginateDto } from '../restful/dtos';
import { ReqUser } from '../user/decorators';

import { UserEntity } from '../user/entities';

import { CreateCollectDto, QueryCollectDto } from './collect.dto';
import { CollectService } from './collect.service';
import { CollectEntity } from './entities/collect.entity';

@ApiBearerAuth()
@ApiTags('收藏夹')
@Controller('collect')
export class CollectController {
    constructor(private readonly collectService: CollectService) {}

    @Post()
    async create(@ReqUser() user: UserEntity, @Body() createCollectDto: CreateCollectDto) {
        return this.collectService.create(
            await UserEntity.findOneBy({ id: user.userId }),
            createCollectDto.title,
        );
    }

    @Get()
    async list(@Query() options: QueryCollectDto) {
        return this.collectService.list(options);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Query() options: PaginateDto) {
        const collect = await CollectEntity.findOneBy({ id });
        if (isNil(collect)) {
            throw new BadRequestException('收藏夹不存在');
        }
        return this.collectService.getPosts(collect, options);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @ReqUser() user: UserEntity) {
        const collect = await CollectEntity.findOneBy({ id });
        if (isNil(collect) || collect.user.id !== user.userId) {
            throw new BadRequestException('收藏夹不存在');
        }
        collect.softRemove();
    }
}
