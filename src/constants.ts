/* eslint-disable global-require */
import { existsSync } from 'fs';

import { join } from 'path';

import { NestFactory } from '@nestjs/core';

import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { isNil } from 'lodash';

import * as configs from './config';
import { CircleModule } from './modules/circle/circle.module';
import { CollectModule } from './modules/collect/collect.module';
import { ContentModule } from './modules/content/content.module';
import { CreateOptions } from './modules/core/types';
import * as dbCommands from './modules/database/commands';
import { DatabaseModule } from './modules/database/database.module';
import { MeilliModule } from './modules/meilisearch/melli.module';
import { PostModule } from './modules/post/post.module';
import { Restful } from './modules/restful/restful';
import { RestfulModule } from './modules/restful/restful.module';
import { ApiConfig } from './modules/restful/types';
import { JwtAuthGuard } from './modules/user/guards';
import { UserModule } from './modules/user/user.module';
import { AuthenticatedSocketIoAdapter } from './modules/ws/common/authenticated.socketio.adapter';
import { WsModule } from './modules/ws/ws.module';
import { CommentModule } from './modules/comment/comment.module';
import { FeedModule } from './modules/feed/feed.module';
import { CourseModule } from './modules/course/course.module';

export const createOptions: CreateOptions = {
    config: { factories: configs, storage: { enabled: true } },
    modules: async (configure) => [
        DatabaseModule.forRoot(configure),
        MeilliModule.forRoot(configure),
        RestfulModule.forRoot(configure),
        ContentModule.forRoot(configure),
        UserModule.forRoot(configure),
        CircleModule.forRoot(configure),
        WsModule.forRoot(configure),
        PostModule.forRoot(configure),
        CollectModule.forRoot(configure),
        CommentModule.forRoot(configure),
        FeedModule.forRoot(configure),
        CourseModule.forRoot(configure),
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
        container.useWebSocketAdapter(new AuthenticatedSocketIoAdapter(container));
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
