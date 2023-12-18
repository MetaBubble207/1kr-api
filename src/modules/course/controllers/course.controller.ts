import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ReqUser } from "../../user/decorators";
import { UserEntity } from "../../user/entities";
import { CreateCourseDto, QueryCourseDto, UpdateCourseDto } from "../dtos/course.dto";
import { CourseService } from "../services";
import { SocialCircleEntity } from "../../circle/entities";
import { MemberService } from "../../circle/services";
import { CourseEntity } from "../entities";
import { Depends } from "../../restful/decorators";
import { CourseModule } from "../course.module";

@ApiBearerAuth()
@ApiTags('课程')
@Depends(CourseModule)
@Controller('courses')
export class CourseController {
    constructor(
        private readonly courseService: CourseService,
        private readonly memberService: MemberService,
    ) {}

    /**
     * 创建课程
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
     * 分页查询课程列表
     */
    @Get()
    async list(
        @Query() options: QueryCourseDto,
        @ReqUser() user: UserEntity,
    ) {
        const circle = await SocialCircleEntity.findOneOrFail({where: {id: options.circleId}, relations: ['user']});
        if (!circle) {
            throw new BadRequestException('圈子不存在');
        }
        if (circle.user.id !== user.id || this.memberService.isMember(circle.id, user.id)) {
            throw new BadRequestException('请先订阅圈子');
        }

        return this.courseService.getCourses(options, user);
    }

    /**
     * 获取课程详情
     * @param id 
     * @param user 
     */
    @Get(':id')
    async findOne(@Param('id') id: string, @ReqUser() user: UserEntity) {
        return this.courseService.getCourse(id, user);
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