import { isNumber } from 'lodash';

export const convertToFriendlyTime = (date: number | Date): string => {
    const now = new Date().getTime();
    const originTimestamp = isNumber(date) ? (date as number) : (date as Date).getTime();
    const diffTime = (now - originTimestamp) / 1000;
    switch (true) {
        case diffTime < 60:
            return '刚刚';
        case diffTime < 60 * 60:
            return `${Math.floor(diffTime / 60)}分钟前`;
        case diffTime < 60 * 60 * 24:
            return `${Math.floor(diffTime / 60 / 60)}小时前`;
        case diffTime < 60 * 60 * 24 * 7:
            return `${Math.floor(diffTime / 60 / 60 / 24)}天前`;
        default:
            return `${new Date(originTimestamp).getFullYear()}/${
                new Date(originTimestamp).getMonth() + 1
            }/${new Date(originTimestamp).getDate()}`;
    }
};
