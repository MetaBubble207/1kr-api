import { Controller, Get, Query } from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Depends } from '../restful/decorators';
import { PaginateDto } from '../restful/dtos';
import { ReqUser } from '../user/decorators';
import { UserEntity } from '../user/entities/user.entity';

import { FeedModule } from './feed.module';
import { FeedService } from './feed.service';

@ApiBearerAuth()
@ApiTags('关注动态')
@Depends(FeedModule)
@Controller('feeds')
export class FeedController {
    constructor(private readonly feedService: FeedService) {}

    @Get()
    @ApiOperation({ summary: '关注动态列表' })
    async list(@Query() options: PaginateDto, @ReqUser() user: UserEntity) {
        return this.feedService.getTimelineFeeds(user.userId, options);
    }
}
