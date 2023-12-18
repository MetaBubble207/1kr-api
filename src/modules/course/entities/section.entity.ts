import { Column, Entity, Index, ManyToOne, OneToMany } from "typeorm";
import { BaseWithDeletedEntity } from "../../core/common/base.entity";
import { Exclude, Expose } from "class-transformer";
import { ChapterEntity } from "./chapter.entity";
import { PostEntity } from "../../post/entities";
import type { Relation } from "typeorm";

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
        default: '',
        type: 'text'
    })
    content: string;

    @Column({comment: '是否可试看', default: false})
    free: boolean;

    @Column({comment: '时长', default: 0, unsigned: true})
    duration: number;

    @OneToMany(() => PostEntity, (post) => post.section)
    posts: Relation<PostEntity>[];
}