import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { Redis } from 'ioredis';

import { isNil } from 'lodash';

import { NAMESPACES_MEMBER } from '@/modules/core/constants/redis.constant';

import { paginate } from '@/modules/database/helpers';
import { UserEntity } from '@/modules/user/entities';

import { QueryMemberDto } from '../dtos/member.dto';
import { SocialCircleEntity, SocialCircleUserEntity } from '../entities';
import { ExitCircleEvent } from '../events/exit.circle.event';
import { JoinCircleEvent } from '../events/join.circle.event';

@Injectable()
export class MemberService {
    constructor(
        protected readonly redisService: RedisService,
        protected readonly eventEmitter: EventEmitter2,
    ) {}

    /**
     * 加入免费圈子
     * @param user
     * @param circle
     */
    async join(user: UserEntity, circle: SocialCircleEntity): Promise<boolean> {
        // 付费圈子
        if (!circle.free) {
            return false;
        }
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

    /**
     * 退出免费圈子
     * @param user
     * @param circle
     */
    async exit(user: UserEntity, circle: SocialCircleEntity): Promise<boolean> {
        if (!circle.free) {
            return false;
        }
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

    /**
     * 成员列表
     * @param queryDto
     */
    async list(circle: SocialCircleEntity, queryDto: QueryMemberDto) {
        const query = SocialCircleUserEntity.createQueryBuilder('circle_user')
            .leftJoinAndSelect('circle_user.user', 'user')
            .where('circle_user.circle = :circle', { circle })
            .orderBy('circle_user.createdAt', 'DESC');
        if (!circle.free) {
            query.andWhere('circle_user.expiredTime >= :now', {
                now: Math.floor(Date.now() / 1000),
            });
        }
        return paginate(query, queryDto);
    }

    /**
     * 设置圈子成员(redis)
     * @param circleId
     * @param userId
     * @param expiredTime
     */
    async setMember(circleId: string, userId: string, expiredTime: number = 2524608000) {
        this.getRedisClient().zadd(this.getRedisKey(circleId), expiredTime, userId);
    }

    /**
     * 会员剩余时间
     * @param circleId
     * @param userId
     */
    async remainingTime(circleId: string, userId: string): Promise<number> {
        const expiredTime = await this.getRedisClient().zscore(this.getRedisKey(circleId), userId);
        if (isNil(expiredTime)) {
            return 0;
        }
        const remainingSeconds = parseInt(expiredTime, 10) - Math.floor(Date.now() / 1000);
        return remainingSeconds > 0 ? remainingSeconds : 0;
    }

    /**
     * 是否是会员
     * @param circleId
     * @param userId
     */
    async isMember(circleId: string, userId: string): Promise<boolean> {
        return (await this.remainingTime(circleId, userId)) > 0;
    }

    private getRedisKey(circleId: string): string {
        return `m:${circleId}`;
    }

    private getRedisClient(): Redis {
        return this.redisService.getClient(NAMESPACES_MEMBER);
    }
}
