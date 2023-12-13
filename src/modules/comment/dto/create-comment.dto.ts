import { IsDefined, IsNumber, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateCommentDto {
    @IsDefined({message: '请传入文章ID'})
    @IsUUID()
    readonly postId: string;

    @IsString()
    @Length(1, 10000)
    readonly content: string;

    @IsNumber()
    @IsOptional()
    readonly parent: number;
}
