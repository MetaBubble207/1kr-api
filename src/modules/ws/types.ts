import { Socket } from 'socket.io';

import { MessageType } from './common/constants';
import { MessageEntity } from './entities/message.entity';

// 用户信息
export interface SocketWithUserData extends Socket {
    user: {
        id: string;
        lastActiveTime: number;
        circles: Map<string, number>; // 预留结构方便后期兼容多端同时在线
    };
}

export interface UserSocket extends Map<string, string> {}

export interface Message {
    type: MessageType;
    content: string;
    replyMessageId?: number;
}

export interface SendMessage extends Message {
    fromUser: {
        id: string;
        username: string;
        avatar: string;
    };
    sendTime: number;
    replyMessage?: MessageEntity;
}
