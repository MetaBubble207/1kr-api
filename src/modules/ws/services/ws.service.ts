import { Injectable } from '@nestjs/common';

import { Server, Socket } from 'socket.io';

import { MemberService } from '../../circle/services';

import { UserEntity } from '../../user/entities';
import { MessageType } from '../common/constants';
import { GroupMessageDto } from '../dtos/groupMessage.dto';
import { MessageEntity } from '../entities/message.entity';
import { SendMessage, UserSocket } from '../types';

@Injectable()
export class WsService {
    // userId => socket id
    private userSocket: UserSocket;

    private server: Server;

    constructor(protected memberService: MemberService) {
        this.userSocket = new Map();
    }

    setServer(server: Server) {
        console.log('set server');
        this.server = server;
    }

    getUserSocketId(userId: string) {
        return this.userSocket.get(userId);
    }

    addUserSocket(userId: string, client: Socket) {
        this.userSocket.set(userId, client.id);
        console.log(
            `add socket ${userId} - ${client.id} - ${this.userSocket.size} - ${this.getUserSocketId(
                userId,
            )} - ${this.userSocket.has(userId)}`,
        );
    }

    removeUserSocket(userId: string) {
        console.log(`remove socket ${userId}`);
        this.userSocket.delete(userId);
    }

    async pushMessageToUser(toUserId: string, event: string, data: any) {
        console.log(this.userSocket.size);
        if (!this.userSocket.has(toUserId)) {
            console.log(`${toUserId}不在线`);
            return;
        }
        this.server.to(this.getUserSocketId(toUserId)).emit(event, data);
    }

    /**
     * 群聊
     * @param client
     * @param circleId
     * @param message
     */
    async sendMessageToRoom(client: Socket, message: GroupMessageDto) {
        console.log('group message', typeof message, message);
        if (!this.memberService.isMember(message.circleId, client.user.id)) {
            client.emit('error', 'not in circle');
            console.log('not in circle');
            return;
        }
        // 暂时直接写库
        const messageEntity = new MessageEntity();
        messageEntity.circleId = message.circleId;
        messageEntity.userId = client.user.id;
        messageEntity.type = message.type;
        messageEntity.content = message.content;
        messageEntity.parentId = message.replyMessageId || 0;
        messageEntity.sendTime = Math.floor(Date.now() / 1000);
        await messageEntity.save();
        const user = await UserEntity.findOneBy({ id: client.user.id });
        const broadMessage: SendMessage = {
            type: message.type as MessageType,
            content: message.content,
            fromUser: {
                id: user.id,
                username: user.username,
                avatar: '',
            },
            sendTime: messageEntity.sendTime,
            replyMessage: message.replyMessageId
                ? await MessageEntity.findOneBy({ id: message.replyMessageId })
                : null,
        };
        client.to(`room:${message.circleId}`).emit('chat', broadMessage); // 发送者不会收到
    }
}
