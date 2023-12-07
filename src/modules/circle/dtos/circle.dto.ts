import { IsDefined, IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';
import { PaginateDto } from '@/modules/restful/dtos';

@DtoValidation({ groups: ['create'] })
export class CreateCircleDto {
    /**
     * 名称
     */
    @MaxLength(15, {
        always: true,
        message: '圈子名称长度最大为$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '圈子名称必须填写' })
    @IsOptional({ groups: ['update'] })
    name: string;

    /**
     * 描述
     */
    @IsNotEmpty({ groups: ['create'], message: '圈子描述必须填写' })
    @IsOptional({ groups: ['update'] })
    description: string;

    /**
     * 封面
     */
    @IsNotEmpty({ groups: ['create'], message: '圈子封面必须填写' })
    @IsOptional({ groups: ['update'] })
    cover?: string;

    /**
     * 背景图片
     */
    @IsNotEmpty({ groups: ['create'], message: '圈子背景图片必须填写' })
    @IsOptional({ always: true })
    bgImage?: string;

    /**
     * 关联标签ID
     */
    @IsUUID(undefined, {
        each: true,
        always: true,
        message: 'ID格式不正确',
    })
    @IsNotEmpty({ groups: ['create'], message: '标签必须设置' })
    @IsOptional({ always: true })
    tags?: string[];
}

export class UpdateCircleDto extends CreateCircleDto {}

export class JoinCircleDto {
    @IsUUID(undefined, { message: '圈子ID格式错误' })
    @IsDefined({ message: '圈子ID必须指定' })
    id: string;
}

export class ExitCircleDto extends JoinCircleDto {}

export class FollowCircleDto extends JoinCircleDto {}

export class UnFollowCircleDto extends FollowCircleDto {}

export class QueryFollowerCircleDto extends PaginateDto {
    @IsUUID(undefined, { message: '圈子ID格式错误' })
    @IsDefined({ message: '圈子ID必须指定' })
    id: string;
}
