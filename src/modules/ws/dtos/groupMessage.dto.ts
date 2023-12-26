import { IsDefined, IsEnum, IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';

import { MessageType } from '../common/constants';

export class GroupMessageDto {
    @IsUUID(undefined, { message: '圈子ID格式错误' })
    @IsDefined({ message: '圈子ID必须指定' })
    @IsNotEmpty()
    circleId: string;

    @IsEnum(MessageType)
    type: string;

    @MaxLength(1000)
    @IsNotEmpty()
    content: string;

    @IsOptional()
    replyMessageId?: number;
}
