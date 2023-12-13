import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import type { Relation } from 'typeorm';

import { BaseEntity, BaseWithUpdatedEntity } from '@/modules/core/common/base.entity';

import { SocialCircleEntity } from './circle.entity';

@Exclude()
@Unique('uniq_name', ['name'])
@Entity('tags')
export class TagEntity extends BaseWithUpdatedEntity {
    @Expose()
    @Column({ comment: '名称', type: 'char', length: 15 })
    name: string;

    @OneToMany(() => SocialCircleTagEntity, (circleTag) => circleTag.tag)
    circles: Relation<SocialCircleTagEntity>[];
}

@Unique('uniq_circel_tag', ['circle', 'tag'])
@Entity('social_circle_tags')
export class SocialCircleTagEntity extends BaseEntity {
    @Expose()
    @ManyToOne(() => TagEntity, (tag) => tag.circles)
    tag: Relation<TagEntity>;

    @Expose()
    @ManyToOne(() => SocialCircleEntity, (circle) => circle.members)
    circle: Relation<SocialCircleEntity>;
}
