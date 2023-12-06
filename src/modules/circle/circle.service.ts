import { Injectable } from '@nestjs/common';

import { EventEmitter2 } from '@nestjs/event-emitter';

import { In } from 'typeorm';

import { BaseService } from '../database/base';

import { UserEntity } from '../user/entities';

import { CreateCircleDto, UpdateCircleDto } from './dtos/circle.dto';
import { SocialCircleEntity, SocialCircleFollowerEntity, SocialCircleUserEntity } from './entities';
import { SocialCircleTagEntity, TagEntity } from './entities/tag.entity';
import { CreateCircleEvent } from './events/create.circle.event';
import { ExitCircleEvent } from './events/exit.circle.event';
import { FollowCircleEvent, UnFollowCircleEvent } from './events/follow.circle.event';
import { JoinCircleEvent } from './events/join.circle.event';
import { CircleRepository } from './repositories';

@Injectable()
export class CircleService extends BaseService<SocialCircleEntity, CircleRepository> {
    constructor(
        protected repository: CircleRepository,
        protected readonly eventEmitter: EventEmitter2,
    ) {
        super(repository);
    }

    async createCircle(
        user: UserEntity,
        { tags, ...options }: CreateCircleDto,
    ): Promise<SocialCircleEntity | null> {
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

    async updateCircle(circle: SocialCircleEntity, { tags, ...options }: UpdateCircleDto) {
        await SocialCircleEntity.createQueryBuilder()
            .update()
            .where('id = :id', { id: circle.id })
            .set(options)
            .execute()
            .catch((e: any) => {
                if (e.code && e.code === '23505') {
                    throw new Error('圈子名称已被占用，请更换后重试');
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

    async join(user: UserEntity, circle: SocialCircleEntity): Promise<boolean> {
        const result = await SocialCircleUserEntity.createQueryBuilder()
            .insert()
            .orIgnore()
            .updateEntity(false)
            .values({
                user,
                circle,
            })
            .execute();
        if (result.raw.affectedRows === 1) {
            this.eventEmitter.emit(
                'circle.join',
                new JoinCircleEvent({
                    circleId: circle.id,
                    userId: user.id,
                }),
            );
        }

        return true;
    }

    async exit(user: UserEntity, circle: SocialCircleEntity): Promise<boolean> {
        const result = await SocialCircleUserEntity.createQueryBuilder()
            .delete()
            .where({
                user,
                circle,
            })
            .execute();
        if (result.raw.affectedRows === 1) {
            this.eventEmitter.emit(
                'circle.exit',
                new ExitCircleEvent({
                    circleId: circle.id,
                    userId: user.id,
                }),
            );
        }

        return true;
    }

    async follow(user: UserEntity, circle: SocialCircleEntity): Promise<boolean> {
        const result = await SocialCircleFollowerEntity.createQueryBuilder()
            .insert()
            .orIgnore()
            .updateEntity(false)
            .values({
                user,
                circle,
            })
            .execute();
        if (result.raw.affectedRows === 1) {
            this.eventEmitter.emit(
                'circle.follow',
                new FollowCircleEvent({
                    circleId: circle.id,
                    userId: user.id,
                }),
            );
        }

        return true;
    }

    async unFollow(user: UserEntity, circle: SocialCircleEntity): Promise<boolean> {
        const result = await SocialCircleFollowerEntity.createQueryBuilder()
            .delete()
            .where({
                user,
                circle,
            })
            .execute();
        if (result.raw.affectedRows === 1) {
            this.eventEmitter.emit(
                'circle.unFollow',
                new UnFollowCircleEvent({
                    circleId: circle.id,
                    userId: user.id,
                }),
            );
        }

        return true;
    }
}
