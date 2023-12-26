import { OnEvent } from '@nestjs/event-emitter';

import { UserEntity } from '../user/entities';
import { RegisteredEvent } from '../user/events/registered.event';

import { CollectEntity } from './entities';

export class CollectListener {
    @OnEvent('user.registered')
    async handleUserregisteredEvent(payload: RegisteredEvent) {
        console.log(`user ${payload.userId} registered`);
        // 初始化用户的默认收藏夹
        await CollectEntity.save({
            user: await UserEntity.findOneBy({ id: payload.userId }),
            title: 'default',
        });
    }
}
