import { IsNotEmpty, IsNumber } from 'class-validator';
import { PaginateDto } from '../../restful/dtos';

export class VoteDto {
    @IsNotEmpty()
    @IsNumber()
    commentId: number;
}

export class UnvoteDto extends VoteDto {}

export class QueryVoterDto extends PaginateDto {
    @IsNumber()
    commentId: number;
}
