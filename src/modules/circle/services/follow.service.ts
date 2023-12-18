import { UserEntity } from "@/modules/user/entities";
import { Injectable } from "@nestjs/common";
import { SocialCircleEntity, SocialCircleFollowerEntity } from "../entities";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { FollowCircleEvent, UnFollowCircleEvent } from "../events/follow.circle.event";

@Injectable()
export class FollowService {
    constructor(
        protected readonly eventEmitter: EventEmitter2,
    ) {}
    
    /**
     * 关注
     * @param user
     * @param circle
     */
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

    /**
     * 取消关注
     * @param user
     * @param circle
     */
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

    async getFollowers(circle: SocialCircleEntity, page = 1, limit = 10) {
        return SocialCircleFollowerEntity.createQueryBuilder('circle_follower')
            .leftJoinAndSelect(`circle_follower.follower`, 'follower')
            .leftJoinAndSelect(`circle_follower.circle`, 'circle')
            .where('circle.id = :circleId', { circleId: circle.id })
            .select(['follower.id', 'follower.username'])
            .orderBy(`circle_follower.id`, 'DESC')
            .offset((page - 1) * limit)
            .limit(10)
            .getRawMany();
    }

    async isFollowing(userId: string, circleId: string): Promise<boolean> {
        return SocialCircleFollowerEntity.createQueryBuilder()
            .where('userId = :userId', { userId })
            .andWhere('circleId = :circleId', { circleId })
            .getExists();
    }
}