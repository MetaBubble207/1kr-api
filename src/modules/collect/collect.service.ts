import { Injectable } from '@nestjs/common';

import { paginate } from '../database/helpers';
import { PaginateDto } from '../restful/dtos';
import { UserEntity } from '../user/entities/user.entity';

import { QueryCollectDto } from './collect.dto';
import { CollectEntity, CollectPostEntity } from './entities/collect.entity';

@Injectable()
export class CollectService {
    async create(user: UserEntity, title: string) {
        const collect = await CollectEntity.createQueryBuilder()
            .insert()
            .updateEntity(false)
            .values({
                title,
                user,
            })
            .execute();
        return CollectEntity.findOneBy({ id: collect.raw.insertId });
    }

    async list(options: QueryCollectDto) {
        return paginate(
            CollectEntity.createQueryBuilder()
                .where('userId = userId', { userId: options.userId })
                .orderBy('id', 'DESC'),
            options,
        );
    }

    async getPosts(collect: CollectEntity, options: PaginateDto) {
        return paginate(
            CollectPostEntity.createQueryBuilder('collect_post')
                .leftJoinAndSelect(`${'collect_post'}.post`, 'post')
                .where('collect_post.collectId = :collectId', { collectId: collect.id })
                .select(['post.*', `collect_post.remark`, `collect_post.createdAt`])
                .orderBy(`collect_post.id`, 'DESC'),
            options,
        );
    }

    async delete(collect: CollectEntity) {
        collect.remove();
    }

    async getUserReceivedCollectCount(userId: number): Promise<number> {
        return CollectPostEntity.createQueryBuilder('collect_post')
            .leftJoinAndSelect('collect_post.post', 'post')
            .where('post.userId = :userId', { userId })
            .getCount();
    }
}
