import { BadRequestException, Injectable } from '@nestjs/common';

import { EventEmitter2 } from '@nestjs/event-emitter';

import { SocialCircleEntity } from '../../circle/entities';
import { MemberService } from '../../circle/services';
import { paginate } from '../../database/helpers';
import { UserEntity } from '../../user/entities';
import { CreateCourseDto, QueryCourseDto, UpdateCourseDto } from '../dtos/course.dto';
import { CreateSectionDto, UpdateSectionDto } from '../dtos/section.dto';
import { ChapterEntity, CourseEntity, SectionEntity } from '../entities';
import { CreateCourseEvent, DeleteCourseEvent, PublishCourseEvent } from '../events/course.event';
import {
    CreateSectionEvent,
    PublishSectionEvent,
    DeleteSectionEvent,
} from '../events/section.event';

@Injectable()
export class CourseService {
    constructor(
        protected readonly eventEmitter: EventEmitter2,
        protected readonly memberService: MemberService,
    ) {}

    async createCourse(circle: SocialCircleEntity, data: CreateCourseDto): Promise<CourseEntity> {
        const course = await CourseEntity.save({
            ...data,
            circle,
        });

        this.eventEmitter.emit(
            'course.create',
            new CreateCourseEvent({
                courseId: course.id,
            }),
        );

        if (course.online) {
            this.eventEmitter.emit(
                'course.publish',
                new PublishCourseEvent({
                    courseId: course.id,
                }),
            );
        }

        return course;
    }

    async updateCourse(course: CourseEntity, data: UpdateCourseDto) {
        return CourseEntity.createQueryBuilder()
            .update()
            .where('id = :id', { id: course.id })
            .set(data)
            .execute();
    }

    async deleteCourse(course: CourseEntity) {
        if (!course.deletedAt) {
            await course.softRemove();
            if (course.online) {
                this.eventEmitter.emit(
                    'course.delete',
                    new DeleteCourseEvent({
                        courseId: course.id,
                    }),
                );
            }
        }
    }

    async getCourses(options: QueryCourseDto, user: UserEntity) {
        const circle = await SocialCircleEntity.findOneOrFail({
            where: { id: options.circleId },
            relations: ['user'],
        });
        if (!circle) {
            throw new BadRequestException('圈子不存在');
        }
        const query = CourseEntity.createQueryBuilder('course')
            .leftJoinAndSelect('course.circle', 'circle')
            .leftJoinAndSelect('course.chapters', 'chapters')
            .leftJoinAndSelect('chapters.sections', 'sections')
            .where('circle.id = :circleId', { circleId: options.circleId })
            .orderBy('chapters.sequence', 'ASC')
            .addOrderBy('sections.sequence', 'ASC');
        if (circle.user.id !== user.id || !this.memberService.isMember(circle.id, user.id)) {
            query.andWhere('sections.free = :free', { free: true });
        }
        return paginate(query, options);
    }

    async getCourse(courseId: string, user: UserEntity) {
        const course = await CourseEntity.findOneOrFail({
            where: { id: courseId },
            relations: ['circle', 'circle.user'],
        });
        if (!course) {
            throw new BadRequestException('课程不存在');
        }
        const query = CourseEntity.createQueryBuilder('course')
            .leftJoinAndSelect('course.chapters', 'chapters')
            .leftJoinAndSelect('chapters.sections', 'sections')
            .where('course.id = :courseId', { courseId })
            .orderBy('chapters.sequence', 'ASC')
            .addOrderBy('sections.sequence', 'ASC');
        if (
            course.circle.user.id !== user.id ||
            !this.memberService.isMember(course.circle.id, user.id)
        ) {
            query.andWhere('sections.free = :free', { free: true });
        }
        return query.getOne();
    }

    async createSection(chapter: ChapterEntity, data: CreateSectionDto): Promise<SectionEntity> {
        const section = await SectionEntity.save({
            ...data,
            chapter,
        });

        this.eventEmitter.emit(
            'section.create',
            new CreateSectionEvent({
                sectionId: section.id,
            }),
        );

        if (section.online) {
            this.eventEmitter.emit(
                'section.publish',
                new PublishSectionEvent({
                    sectionId: section.id,
                }),
            );
        }

        return section;
    }

    async updateSection(section: SectionEntity, data: UpdateSectionDto) {
        return SectionEntity.createQueryBuilder()
            .update()
            .where('id = :id', { id: section.id })
            .set(data)
            .execute();
    }

    async deleteSection(section: SectionEntity) {
        if (!section.deletedAt) {
            await section.softRemove();
            if (section.online) {
                this.eventEmitter.emit(
                    'section.delete',
                    new DeleteSectionEvent({
                        sectionId: section.id,
                    }),
                );
            }
        }
    }
}
