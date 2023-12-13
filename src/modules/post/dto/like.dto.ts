import { IsNotEmpty } from 'class-validator';

import { PaginateDto } from '@/modules/restful/dtos';

export class LikeDto {
    @IsNotEmpty()
    postId: string;
}

export class UnlikeDto extends LikeDto {}

export class QueryPostLikeDto extends PaginateDto {
    @IsNotEmpty()
    postId: string;
}
