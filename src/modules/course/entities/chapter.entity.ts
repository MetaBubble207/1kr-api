import { Column, Entity, Index, ManyToOne, OneToMany } from "typeorm";
import { BaseWithDeletedEntity } from "../../core/common/base.entity";
import { Exclude, Expose } from "class-transformer";
import { CourseEntity } from "./course.entity";
import { SectionEntity } from "./section.entity";

@Exclude()
@Index('idx_course_createdAt', ['course', 'createdAt'])
@Entity('social_circle_chapters')
export class ChapterEntity extends BaseWithDeletedEntity {
    @Expose()
    @ManyToOne(() => CourseEntity, (circle) => circle.chapters, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    course: CourseEntity;

    @Expose()
    @Column({
        comment: '标题',
        default: '',
    })
    title: string;

    @Expose()
    @OneToMany(() => SectionEntity, (section) => section.chapter)
    sections: SectionEntity[];
}