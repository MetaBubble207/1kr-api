import { PaginateDto } from '@/modules/restful/dtos';
import { IsNumber, IsUUID } from 'class-validator';

export class QueryPostCommentDto extends PaginateDto {
    @IsUUID()
    readonly postId: string;
}

export class QueryChildrenCommentDto extends PaginateDto {
    @IsNumber()
    readonly parent: number;
}
