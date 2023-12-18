import { OmitType } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsUUID, Length } from 'class-validator';

/**
 * 圈子论坛贴
 */
export class CreatePostDto {
    /**
     * 圈子ID
     */
    @IsUUID()
    @IsDefined({ message: '圈子ID必须指定' })
    circleId: string;

    /**
     * 文章标题
     */
    @IsNotEmpty()
    @IsDefined({ message: '文章标题不能为空' })
    title: string;

    /**
     * 文章内容
     */
    @Length(2, 10000)
    @IsDefined({ message: '文章内容不能为空' })
    content: string;
}

/**
 * 圈主动态
 */
export class CreateFeedDto extends CreatePostDto {}

/**
 * 课程问答帖
 */
export class CreateQuestionDto extends OmitType(CreatePostDto, ['circleId']) {
    /**
     * 文章ID，问答模块
     */
    @IsDefined({ message: '文章ID必须指定' })
    @IsUUID()
    sectionId: string;
}
