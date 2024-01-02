import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';

import type { Relation } from 'typeorm';

import { BaseWithDeletedEntity } from '../../core/common/base.entity';

import { PostEntity } from '../../post/entities';

import { ChapterEntity } from './chapter.entity';

@Exclude()
@Index('idx_chapter_createdAt', ['chapter', 'createdAt'])
@Entity('social_circle_sections')
export class SectionEntity extends BaseWithDeletedEntity {
    @Expose()
    @ManyToOne(() => ChapterEntity, (chapter) => chapter.sections, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    chapter: Relation<ChapterEntity>;

    @Expose()
    @Column({
        comment: '标题',
        default: '',
    })
    title: string;

    @Expose()
    @Column({
        comment: '内容',
        type: 'text',
        nullable: true,
    })
    content: string;

    @Column({ comment: '是否可试看', default: false })
    free: boolean;

    @Column({ comment: '时长', default: 0, unsigned: true })
    duration: number;

    @Expose()
    @Column({
        comment: '是否上线',
        default: false,
    })
    online: boolean;

    @Column({
        comment: '索引',
        default: 1,
    })
    sequence: number;

    @OneToMany(() => PostEntity, (post) => post.section)
    posts: Relation<PostEntity>[];
}
