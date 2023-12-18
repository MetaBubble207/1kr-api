import { IsDefined, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreatePostDto {
    /**
     * 圈子ID
     */
    @IsNotEmpty()
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

    /**
     * 图片
     */
    @IsOptional()
    images?: string;

    /**
     * 视频地址
     */
    @IsOptional()
    videoUrl?: string;
}
