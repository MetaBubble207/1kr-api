import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { UserEntity } from '../user/entities';

import { SocialCircleEntity, SocialCircleUserEntity } from './entities';
import { CreateCircleEvent } from './events/create.circle.event';
import { ExitCircleEvent } from './events/exit.circle.event';
import { FollowCircleEvent, UnFollowCircleEvent } from './events/follow.circle.event';
import { JoinCircleEvent } from './events/join.circle.event';
import { MemberService } from './services';

@Injectable()
export class CircleListener {
    constructor(protected memberService: MemberService) {}

    @OnEvent('circle.create')
    async handleCircleCreate(payload: CreateCircleEvent) {
        SocialCircleUserEntity.createQueryBuilder()
            .insert()
            .updateEntity(false)
            .values({
                circle: await SocialCircleEntity.findOneBy({ id: payload.circleId }),
                user: await UserEntity.findOneBy({ id: payload.userId }),
            })
            .execute();

        SocialCircleEntity.createQueryBuilder()
            .update(SocialCircleEntity)
            .where('id = :id', { id: payload.circleId })
            .set({
                memberCount: () => 'memberCount + 1',
            })
            .execute();
    }

    @OnEvent('circle.join')
    async handleCircleJoin(payload: JoinCircleEvent) {
        SocialCircleEntity.createQueryBuilder()
            .update(SocialCircleEntity)
            .where('id = :id', { id: payload.circleId })
            .set({
                memberCount: () => 'memberCount + 1',
            })
            .execute();

        this.memberService.setMember(
            payload.circleId,
            payload.userId,
            payload.expiredTime || 2524608000,
        );
    }

    @OnEvent('circle.exit')
    async handleCircleExit(payload: ExitCircleEvent) {
        SocialCircleEntity.createQueryBuilder()
            .update(SocialCircleEntity)
            .where('id = :id', { id: payload.circleId })
            .andWhere('memberCount > :count', { count: 1 })
            .set({
                memberCount: () => 'memberCount - 1',
            })
            .execute();
    }

    @OnEvent('circle.follow')
    async handleCircleFollow(payload: FollowCircleEvent) {
        SocialCircleEntity.createQueryBuilder()
            .update(SocialCircleEntity)
            .where('id = :id', { id: payload.circleId })
            .set({
                followerCount: () => 'followerCount + 1',
            })
            .execute();
    }

    @OnEvent('circle.unFollow')
    async handleCircleUnFollow(payload: UnFollowCircleEvent) {
        SocialCircleEntity.createQueryBuilder()
            .update(SocialCircleEntity)
            .where('id = :id', { id: payload.circleId })
            .andWhere('followerCount > :count', { count: 1 })
            .set({
                followerCount: () => 'followerCount - 1',
            })
            .execute();
    }
}
