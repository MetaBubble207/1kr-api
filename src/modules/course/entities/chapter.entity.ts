import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';

import { BaseWithDeletedEntity } from '../../core/common/base.entity';

import { CourseEntity } from './course.entity';
import { SectionEntity } from './section.entity';

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

    @Column({
        comment: '索引',
        default: 1,
    })
    sequence: number;

    @Expose()
    @Column({
        comment: '是否上线',
        default: false,
    })
    online: boolean;

    @Expose()
    @OneToMany(() => SectionEntity, (section) => section.chapter)
    sections: SectionEntity[];
}
