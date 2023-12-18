import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

import { PaginateDto } from '@/modules/restful/dtos';

export class QueryPostDto extends PaginateDto {
    /**
     * 圈子ID
     */
    @IsUUID()
    @IsDefined({ message: '圈子ID必须指定' })
    circleId: string;
}

export class QueryFeedDto extends QueryPostDto {}

export class QueryQuestionDto extends PaginateDto {
    /**
     * 文章ID
     */
    @IsUUID()
    @IsDefined({ message: '文章ID必须指定' })
    sectionId: string;
}

export class QueryLikePostDto extends PaginateDto {
    /**
     * 圈子ID
     */
    @IsNotEmpty()
    @IsDefined({ message: '圈子ID必须指定' })
    circleId: string;
}

export class QueryCollectdPostDto extends QueryLikePostDto {
    /**
     * 收藏夹ID
     */
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    collect?: number;
}
