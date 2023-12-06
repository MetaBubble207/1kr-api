/* eslint-disable global-require */
import { existsSync } from 'fs';

import { join } from 'path';

import { NestFactory } from '@nestjs/core';

import { EventEmitterModule } from '@nestjs/event-emitter';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { isNil } from 'lodash';

import * as configs from './config';
import { CircleModule } from './modules/circle/circle.module';
import { ContentModule } from './modules/content/content.module';
import { CreateOptions } from './modules/core/types';
import * as dbCommands from './modules/database/commands';
import { DatabaseModule } from './modules/database/database.module';
import { MeilliModule } from './modules/meilisearch/melli.module';
import { Restful } from './modules/restful/restful';
import { RestfulModule } from './modules/restful/restful.module';
import { ApiConfig } from './modules/restful/types';
import { JwtAuthGuard } from './modules/user/guards';
import { UserModule } from './modules/user/user.module';

export const createOptions: CreateOptions = {
    config: { factories: configs, storage: { enabled: true } },
    modules: async (configure) => [
        DatabaseModule.forRoot(configure),
        MeilliModule.forRoot(configure),
        RestfulModule.forRoot(configure),
        ContentModule.forRoot(configure),
        UserModule.forRoot(configure),
        CircleModule.forRoot(configure),
        {
            ...EventEmitterModule.forRoot({
                // set this to `true` to use wildcards
                wildcard: true,
                // the delimiter used to segment namespaces
                delimiter: '.',
                // set this to `true` if you want to emit the newListener event
                newListener: false,
                // set this to `true` if you want to emit the removeListener event
                removeListener: false,
                // the maximum amount of listeners that can be assigned to an event
                maxListeners: 10,
                // show event name in memory leak message when more than maximum amount of listeners is assigned
                verboseMemoryLeak: false,
                // disable throwing uncaughtException if an error event is emitted and it has no listeners
                ignoreErrors: false,
            }),
            global: true,
        },
    ],
    commands: () => [...Object.values(dbCommands)],
    globals: {
        guard: JwtAuthGuard,
    },
    builder: async ({ configure, BootModule }) => {
        const container = await NestFactory.create<NestFastifyApplication>(
            BootModule,
            new FastifyAdapter(),
            {
                cors: true,
                logger: ['error', 'warn'],
            },
        );
        if (!isNil(await configure.get<ApiConfig>('api', null))) {
            const restful = container.get(Restful);
            /**
             * 判断是否存在metadata模块,存在的话则加载并传入factoryDocs
             */
            let metadata: () => Promise<Record<string, any>>;
            if (existsSync(join(__dirname, 'metadata.js'))) {
                metadata = require(join(__dirname, 'metadata.js')).default;
            }
            if (existsSync(join(__dirname, 'metadata.ts'))) {
                metadata = require(join(__dirname, 'metadata.ts')).default;
            }
            await restful.factoryDocs(container, metadata);
        }
        return container;
    },
};
