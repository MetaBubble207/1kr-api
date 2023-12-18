import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

import { PaginateDto } from '@/modules/restful/dtos';

export class QueryLikePostDto extends PaginateDto {
    /**
     * 圈子ID
     */
    @IsNotEmpty()
    @IsDefined({ message: '圈子ID必须指定' })
    circleId: string;
}

export class QueryPostDto extends PartialType<QueryLikePostDto>(QueryLikePostDto) {}

export class QueryCollectdPostDto extends QueryLikePostDto {
    /**
     * 收藏夹ID
     */
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    collect?: number;
}
