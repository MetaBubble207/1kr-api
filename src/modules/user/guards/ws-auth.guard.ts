import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Socket } from 'socket.io';

import { isClientAliveNow } from '@/modules/ws/helper';

@Injectable()
export class WsAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client = context.switchToWs()?.getClient<Socket>();
        const active = isClientAliveNow(client.user.lastActiveTime);
        active || client.disconnect();
        return active;
    }
}
