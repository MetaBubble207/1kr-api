import 'socket.io';

declare module 'socket.io' {
    class Socket {
        user: {
            id: string;
            lastActiveTime: number;
            circles: Map<string, number>; // 预留结构方便后期兼容多端同时在线
        };
    }
}
