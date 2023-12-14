import { RedisModuleOptions } from '@liaoliaots/nestjs-redis';

import {
    NAMESPACES_DEFAULT,
    NAMESPACES_MEMBER,
    NAMESPACES_QUEUE,
    NAMESPACES_RANK,
} from '@/modules/core/constants/redis.constant';

export const redis = (): RedisModuleOptions => ({
    config: [
        {
            namespace: NAMESPACES_DEFAULT,
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT, 10),
            password: process.env.REDIS_PASSWORD,
            db: 0,
        },
        {
            namespace: NAMESPACES_MEMBER,
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT, 10),
            password: process.env.REDIS_PASSWORD,
            db: 1,
        },
        {
            namespace: NAMESPACES_RANK,
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT, 10),
            password: process.env.REDIS_PASSWORD,
            db: 2,
        },
        {
            namespace: NAMESPACES_QUEUE,
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT, 10),
            password: process.env.REDIS_PASSWORD,
            db: 3,
        },
    ],
});
