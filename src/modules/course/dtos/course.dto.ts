import { IsDefined, IsNotEmpty, IsUUID, Length } from "class-validator";
import { PaginateDto } from "../../restful/dtos";
import { OmitType } from "@nestjs/swagger";

export class QueryCourseDto extends PaginateDto {
    @IsUUID(undefined, { message: '圈子ID格式错误' })
    @IsDefined({ message: '圈子ID必须指定' })
    circleId: string;
}

export class CreateCourseDto {
    /**
     * 圈子ID
     */
    @IsUUID()
    @IsDefined({ message: '圈子ID必须指定' })
    circleId: string;

    /**
     * 标题
     */
    @IsNotEmpty()
    @IsDefined({ message: '课程标题不能为空' })
    title: string;

    /**
     * 介绍
     */
    @Length(2, 10000)
    @IsDefined({ message: '课程介绍不能为空' })
    description: string;

    /**
     * 封面
     */
    @IsDefined({ message: '封面不能为空' })
    cover: string;
}

export class UpdateCourseDto extends OmitType(CreateCourseDto, ['circleId']) {}