import { BadRequestException, Body, Controller, Delete, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ReqUser } from "../../user/decorators";
import { UserEntity } from "../../user/entities";
import { CourseService } from "../services";
import { ChapterEntity, SectionEntity } from "../entities";
import { CreateSectionDto, UpdateSectionDto } from "../dtos/section.dto";
import { Depends } from "../../restful/decorators";
import { CourseModule } from "../course.module";

@ApiBearerAuth()
@ApiTags('文章')
@Depends(CourseModule)
@Controller('sections')
export class SectionController {
    constructor(
        private readonly courseService: CourseService,
    ) {}
    
    /**
     * 创建文章
     */
    @Post()
    async create(@ReqUser() user: UserEntity, @Body() data: CreateSectionDto) {
        const chapter = await ChapterEntity.findOneOrFail({where: {id: data.chapterId}, relations: ['course.circle.user']});
        if (!chapter || chapter.course.circle.user.id !== user.id) {
            throw new BadRequestException('章节不存在');
        }
        return this.courseService.createSection(chapter, data);
    }

    /**
     * 更新文章
     * @param id 
     * @param data 
     * @param user 
     */
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() data: UpdateSectionDto,
        @ReqUser() user: UserEntity,
    ) {
        const section = await SectionEntity.findOne({ where: { id }, relations: ['chapter.course.circle.user'] });
        if (!section || section.chapter.course.circle.user.id !== user.userId) {
            throw new BadRequestException('文章不存在');
        }
        return this.courseService.updateSection(section, data);
    }

    /**
     * 删除文章
     * @param id 
     * @param user 
     */
    @Delete(':id')
    async remove(@Param('id') id: string, @ReqUser() user: UserEntity) {
        const section = await SectionEntity.findOne({ where: { id }, relations: ['chapter.course.circle.user'] });
        if (!section || section.chapter.course.circle.user.id !== user.userId) {
            throw new BadRequestException('文章不存在');
        }
        return this.courseService.deleteSection(section);
    }
}