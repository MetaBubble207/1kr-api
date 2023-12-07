import { RedisModuleOptions } from '@liaoliaots/nestjs-redis';

import { createConnectionOptions } from '@/modules/config/helpers';
import { ConfigureFactory, ConfigureRegister } from '@/modules/config/types';

export const createRedisConfig: (
    register: ConfigureRegister<RePartial<RedisModuleOptions>>,
) => ConfigureFactory<RedisModuleOptions, RedisModuleOptions> = (register) => ({
    register,
    hook: (configure, value) => ({
        config: createConnectionOptions(value),
    }),
});
