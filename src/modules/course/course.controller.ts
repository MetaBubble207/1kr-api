import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ReqUser } from "../user/decorators";
import { UserEntity } from "../user/entities";
import { QueryCourseDto } from "./dtos/course.dto";

@ApiBearerAuth()
@ApiTags('关')
@Controller('courses')
export class CourseController {
    // constructor(
    //     private readonly courseService: CourseService,
    // ) {}

    @Post()
    async create(@ReqUser() user: UserEntity, @Body() data: QueryCourseDto) {
    }

    @Get()
    async list(
        @Query() options: QueryCourseDto,
        @ReqUser() user: UserEntity,
    ) {
        
    }
}