import { Controller, Get, Query } from '@nestjs/common';
import { FeedService } from './feed.service';
import { UserEntity } from '../user/entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReqUser } from '../user/decorators';
import { PaginateDto } from '../restful/dtos';
import { Depends } from '../restful/decorators';
import { FeedModule } from './feed.module';

@ApiBearerAuth()
@ApiTags('关注动态')
@Depends(FeedModule)
@Controller('feeds')
export class FeedController {
    constructor(
        private readonly feedService: FeedService,
    ) {}

    @Get()
    @ApiOperation({ summary: '关注动态列表' })
    async list(
        @Query() options: PaginateDto,
        @ReqUser() user: UserEntity,
    ) {
        return this.feedService.getTimelineFeeds(user.userId, options);
    }
}
