import { IsBoolean, IsDefined, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { OmitType } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { toBoolean } from "../../core/helpers";

export class CreateSectionDto {
    /**
     * 章节ID
     */
    @IsUUID()
    @IsDefined({ message: '章节ID必须指定' })
    chapterId: string;

    /**
     * 标题
     */
    @IsNotEmpty()
    @IsDefined({ message: '文章标题不能为空' })
    title: string;

    /**
     * 内容
     */
    @IsNotEmpty()
    @IsDefined({ message: '文章内容不能为空' })
    content: string;

    /**
     * 是否上线
     */
    @Transform(({ value }) => toBoolean(value))
    @IsBoolean()
    @IsOptional()
    online = false;
}

export class UpdateSectionDto extends OmitType(CreateSectionDto, ['chapterId']) {}