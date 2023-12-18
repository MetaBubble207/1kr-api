import { IsDefined, IsNotEmpty, IsUUID } from "class-validator";
import { OmitType } from "@nestjs/swagger";

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
    @IsDefined({ message: '章节标题不能为空' })
    title: string;
}

export class UpdateSectionDto extends OmitType(CreateSectionDto, ['chapterId']) {}