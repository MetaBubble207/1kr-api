import { IsNotEmpty, IsNumber } from 'class-validator';

export class LikeDto {
    @IsNotEmpty()
    @IsNumber()
    commentId: number;
}

export class UnlikeDto extends LikeDto {}
