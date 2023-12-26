import { IsNumber, IsUUID } from 'class-validator';

import { PaginateDto } from '@/modules/restful/dtos';

export class QueryPostCommentDto extends PaginateDto {
    @IsUUID()
    readonly postId: string;
}

export class QueryChildrenCommentDto extends PaginateDto {
    @IsNumber()
    readonly parent: number;
}
