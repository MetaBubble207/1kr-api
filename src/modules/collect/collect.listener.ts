import { OnEvent } from '@nestjs/event-emitter';
import { RegisteredEvent } from '../user/events/registered.event';
import { CollectEntity } from './entities';
import { UserEntity } from '../user/entities';


export class CollectListener {
    @OnEvent('user.registered')
    async handlePostPublishedEvent(payload: RegisteredEvent) {
        console.log(`user ${payload.userId} registered`);
        // 初始化用户的默认收藏夹
        CollectEntity.create({
            user: await UserEntity.findOneBy({id: payload.userId}),
            title: 'default',
        });
    }
}
