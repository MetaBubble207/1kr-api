// 心跳间隔(ms)
export const HEART_BEAT_INTERVAL = 300000;

// 允许掉线次数
export const HEART_BEAT_ALLOWABLE_DROPED_TIMES = 2;

export enum MessageType {
    TEXT = 'text',
    IMAGE = 'image',
    LINK = 'link',
    REPLY = 'reply',
}
