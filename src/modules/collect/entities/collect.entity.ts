import { Exclude, Expose, Type } from 'class-transformer';

import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';

import { BaseWithDeletedEntity } from '@/modules/core/common/base.entity';

import { PostEntity } from '../../post/entities/post.entity';
import { UserEntity } from '../../user/entities/user.entity';

/**
 * 收藏夹模型
 */
@Exclude()
@Entity('collects')
@Index('idx_user', ['user'])
export class CollectEntity extends BaseWithDeletedEntity {
    @Expose()
    @ManyToOne(() => UserEntity, (user) => user.collects, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    user: UserEntity;

    @OneToMany(() => CollectPostEntity, (collectPost) => collectPost.collect)
    posts: CollectPostEntity[];

    @Expose()
    @Column({ comment: '收藏夹名称' })
    title: string;
}

@Entity('collect_posts')
@Unique('uniq_collect_post', ['collect', 'post'])
@Index('idx_collect', ['collect', 'createdAt'])
export class CollectPostEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Expose()
    @ManyToOne(() => CollectEntity, (collect) => collect.posts)
    collect: CollectEntity;

    @Expose()
    @ManyToOne(() => PostEntity, (post) => post.collects)
    post: PostEntity;

    @Column({ comment: '备注', default: '' })
    remark: string;

    @Expose()
    @Type(() => Date)
    @CreateDateColumn({
        comment: '创建时间',
    })
    createdAt: Date;
}
