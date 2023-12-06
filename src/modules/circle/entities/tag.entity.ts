import { Expose } from 'class-transformer';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';

import { BaseEntity, BaseWithUpdatedEntity } from '@/modules/core/common/base.entity';

import { SocialCircleEntity } from './circle.entity';

@Unique('uniq_name', ['name'])
@Entity('tags')
export class TagEntity extends BaseWithUpdatedEntity {
    @Expose()
    @Column({ comment: '名称', type: 'char', length: 15 })
    name: string;

    circles: SocialCircleTagEntity[];
}

@Unique('uniq_circel_tag', ['circle', 'tag'])
@Entity('social_circle_tags')
export class SocialCircleTagEntity extends BaseEntity {
    @Expose()
    @ManyToOne(() => TagEntity, (tag) => tag.circles)
    tag: TagEntity;

    @Expose()
    @ManyToOne(() => SocialCircleEntity, (circle) => circle.members)
    circle: SocialCircleEntity;
}
