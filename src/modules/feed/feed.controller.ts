import { Controller, Get, Query } from '@nestjs/common';
import { FeedService } from './feed.service';
import { UserEntity } from '../user/entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReqUser } from '../user/decorators';
import { PaginateDto } from '../restful/dtos';

@ApiBearerAuth()
@ApiTags('关注动态')
@Controller('feeds')
export class FeedController {
    constructor(
        private readonly feedService: FeedService,
    ) {}

    @Get()
    async list(
        @Query() options: PaginateDto,
        @ReqUser() user: UserEntity,
    ) {
        return this.feedService.getTimelineFeeds(user.userId, options);
    }
}
