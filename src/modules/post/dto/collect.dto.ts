import { OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { PaginateDto } from '@/modules/restful/dtos';

export class PostCollectDto {
    @IsNotEmpty()
    postId: string;

    @IsOptional()
    collectId?: string;

    @IsString()
    @IsOptional()
    remark?: string;
}

export class CancelPostCollectDto extends OmitType(PostCollectDto, ['remark']) {}

export class QueryPostCollectDto extends PaginateDto {
    @IsNotEmpty()
    postId: string;
}
