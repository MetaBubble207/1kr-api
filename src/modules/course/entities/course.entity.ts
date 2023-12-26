import { Exclude, Expose } from 'class-transformer';
import { AfterLoad, Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';

import { SocialCircleEntity } from '../../circle/entities';
import { BaseWithDeletedEntity } from '../../core/common/base.entity';

import { ChapterEntity } from './chapter.entity';

@Exclude()
@Index('idx_circle_createdAt', ['circle', 'createdAt'])
@Entity('social_circle_courses')
export class CourseEntity extends BaseWithDeletedEntity {
    @Expose()
    @ManyToOne(() => SocialCircleEntity, (circle) => circle.posts, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    circle: SocialCircleEntity;

    @Expose()
    @Column({
        comment: '标题',
        default: '',
    })
    title: string;

    @Expose()
    @Column({
        comment: '介绍',
        default: '',
        length: 10000,
    })
    description: string;

    @Column({
        comment: '封面图',
    })
    cover: string;

    @Expose()
    @Column({
        comment: '问答模块是否开启',
        default: false,
    })
    qa: boolean;

    @Expose()
    @Column({
        comment: '是否上线',
        default: false,
    })
    online: boolean;

    @Expose()
    @OneToMany(() => ChapterEntity, (chapter) => chapter.course)
    chapters: ChapterEntity[];

    @Expose()
    coverUrl: string;

    @AfterLoad()
    handle() {
        this.coverUrl = this.cover; // todo oss拼接
    }
}
