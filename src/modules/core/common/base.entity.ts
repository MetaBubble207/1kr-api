import { Exclude, Expose, Type } from 'class-transformer';
import {
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryColumn,
    BaseEntity as TypeormBaseEntity,
    UpdateDateColumn,
} from 'typeorm';

export class BaseEntity extends TypeormBaseEntity {
    @Expose()
    @PrimaryColumn({ type: 'varchar', generated: 'uuid', length: 36 })
    id: string;

    @Expose()
    @CreateDateColumn({
        comment: '创建时间',
    })
    @Type(() => Date)
    createdAt: Date;
}

export class BaseWithUpdatedEntity extends BaseEntity {
    @Expose()
    @UpdateDateColumn({
        comment: '更新时间',
    })
    @Type(() => Date)
    updatedAt: Date;
}

export class BaseWithDeletedEntity extends BaseWithUpdatedEntity {
    @Exclude()
    @Type(() => Date)
    @DeleteDateColumn({
        comment: '删除时间',
    })
    deletedAt: Date;
}
