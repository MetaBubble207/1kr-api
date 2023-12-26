import { IsDefined, IsNotEmpty, IsUUID } from 'class-validator';

export class JoinDto {
    @IsUUID(undefined, { message: '圈子ID格式错误' })
    @IsDefined({ message: '圈子ID必须指定' })
    @IsNotEmpty()
    circleId: string;
}
