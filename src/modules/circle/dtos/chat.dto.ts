import { IsDefined, IsUUID } from 'class-validator';

import { PaginateDto } from '@/modules/restful/dtos';

export class QueryChatMessageDto extends PaginateDto {
    @IsUUID(undefined, { message: '圈子ID格式错误' })
    @IsDefined({ message: '圈子ID必须指定' })
    circleId: string;
}
