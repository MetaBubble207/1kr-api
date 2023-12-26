import { Controller, Post, Query } from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Depends } from '../restful/decorators';
import { PaginateDto } from '../restful/dtos';
import { Guest, ReqUser } from '../user/decorators';
import { UserEntity } from '../user/entities/user.entity';

import { TradeModule } from './trade.module';

@ApiTags('交易系统')
@Depends(TradeModule)
@Controller('trades')
export class TradeController {
    @Post('wechatPay')
    @Guest()
    @ApiOperation({ summary: '微信支付回调' })
    async wechatPay(@Query() options: PaginateDto, @ReqUser() user: UserEntity) {
        console.log(1);
    }

    @Post('alipay')
    @Guest()
    @ApiOperation({ summary: '支付宝回调' })
    async alipay(@Query() options: PaginateDto, @ReqUser() user: UserEntity) {
        console.log(2);
    }
}
