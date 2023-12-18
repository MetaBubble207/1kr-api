import { BadRequestException, Body, Controller, Delete, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ReqUser } from "../../user/decorators";
import { UserEntity } from "../../user/entities";
import { SocialCircleEntity } from "../../circle/entities";
import { CourseService } from "../services";
import { CreateCourseDto, UpdateCourseDto } from "../dtos/course.dto";
import { CourseEntity } from "../entities";
import { Depends } from "../../restful/decorators";
import { CourseModule } from "../course.module";

@ApiBearerAuth()
@ApiTags('章节')
@Depends(CourseModule)
@Controller('chapters')
export class ChapterController {
    constructor(
        private readonly courseService: CourseService,
    ) {}

    /**
     * 创建章节
     */
    @Post()
    async create(@ReqUser() user: UserEntity, @Body() data: CreateCourseDto) {
        const circle = await SocialCircleEntity.findOneOrFail({where: {id: data.circleId}, relations: ['user']});
        if (!circle || circle.user.id !== user.id) {
            throw new BadRequestException('圈子不存在');
        }
        return this.courseService.createCourse(circle, data);
    }

    /**
     * 更新课程信息
     * @param id 
     * @param data 
     * @param user 
     */
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() data: UpdateCourseDto,
        @ReqUser() user: UserEntity,
    ) {
        const course = await CourseEntity.findOne({ where: { id }, relations: ['circle', 'circle.user'] });
        if (!course || course.circle.user.id !== user.userId) {
            throw new BadRequestException('课程不存在');
        }
        return this.courseService.updateCourse(course, data);
    }

    /**
     * 删除课程
     * @param id 
     * @param user 
     */
    @Delete(':id')
    async remove(@Param('id') id: string, @ReqUser() user: UserEntity) {
        const course = await CourseEntity.findOne({ where: { id }, relations: ['circle', 'circle.user'] });
        if (!course || course.circle.user.id !== user.userId) {
            throw new BadRequestException('课程不存在');
        }
        return this.courseService.deleteCourse(course);
    }
}