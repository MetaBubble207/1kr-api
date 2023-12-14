import { RedisService } from '@liaoliaots/nestjs-redis';
import { BadRequestException, Injectable } from '@nestjs/common';

import { EventEmitter2 } from '@nestjs/event-emitter';

import { In } from 'typeorm';

import { paginate } from '@/modules/database/helpers';

import { BaseService } from '../../database/base';

import { UserEntity } from '../../user/entities';

import { CreateCircleDto, QueryFollowerCircleDto, UpdateCircleDto } from '../dtos/circle.dto';
import { SocialCircleEntity, SocialCircleFollowerEntity } from '../entities';
import { SocialCircleTagEntity, TagEntity } from '../entities/tag.entity';
import { CreateCircleEvent } from '../events/create.circle.event';
import { CircleRepository } from '../repositories';

@Injectable()
export class CircleService extends BaseService<SocialCircleEntity, CircleRepository> {
    constructor(
        protected repository: CircleRepository,
        protected readonly eventEmitter: EventEmitter2,
        protected readonly redisService: RedisService,
    ) {
        super(repository);
    }

    /**
     * 创建圈子
     * @param user
     * @param param1
     */
    async createCircle(
        user: UserEntity,
        { tags, ...options }: CreateCircleDto,
    ): Promise<SocialCircleEntity | null> {
        console.log(await this.redisService.getClient('default').get('aa'));
        const result = await SocialCircleEntity.createQueryBuilder()
            .insert()
            .orIgnore()
            .updateEntity(false)
            .values({
                ...options,
                user,
            })
            .execute();
        if (result.raw.affectedRows === 0) {
            return null;
        }

        const circle = await SocialCircleEntity.findOneBy({ name: options.name });
        this.eventEmitter.emit(
            'circle.create',
            new CreateCircleEvent({
                circleId: circle.id,
                userId: user.id,
            }),
        );

        if (tags) {
            const tagList = await TagEntity.findBy({ id: In(tags) });
            if (tagList.length > 0) {
                await SocialCircleTagEntity.createQueryBuilder()
                    .insert()
                    .updateEntity(false)
                    .values(
                        tagList.map((v) => ({
                            circle,
                            tag: v,
                        })),
                    )
                    .execute();
            }
        }

        return circle;
    }

    /**
     * 更新圈子
     * @param circle
     * @param param1
     */
    async updateCircle(circle: SocialCircleEntity, { tags, ...options }: UpdateCircleDto) {
        await SocialCircleEntity.createQueryBuilder()
            .update()
            .where('id = :id', { id: circle.id })
            .set(options)
            .execute()
            .catch((e: any) => {
                if (e.code && e.code === '23505') {
                    throw new BadRequestException('圈子名称已被占用, 请更改后重试');
                }
            });

        if (tags) {
            const tagList = await TagEntity.findBy({ id: In(tags) });
            if (tagList.length > 0) {
                await SocialCircleTagEntity.createQueryBuilder()
                    .delete()
                    .where('circleId= :circleId', { circleId: circle.id })
                    .execute();

                await SocialCircleTagEntity.createQueryBuilder()
                    .insert()
                    .updateEntity(false)
                    .values(
                        tagList.map((v) => ({
                            circle,
                            tag: v,
                        })),
                    )
                    .execute();
            }
        }
    }

    /**
     * 粉丝列表
     * @param queryDto
     */
    async members(circle: SocialCircleEntity, queryDto: QueryFollowerCircleDto) {
        const query = SocialCircleFollowerEntity.createQueryBuilder('circle_user')
            .leftJoinAndSelect('circle_user.user', 'user')
            .where('circle_user.circle = :circle', { circle })
            .orderBy('circle_user.createdAt', 'DESC');
        return paginate(query, queryDto);
    }
}
