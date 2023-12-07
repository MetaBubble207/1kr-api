import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { DynamicModule, Module } from '@nestjs/common';

import { EventEmitterModule } from '@nestjs/event-emitter';
import { WinstonModule } from 'nest-winston';

import winston from 'winston';

import { Configure } from '../config/configure';

@Module({})
export class CoreModule {
    static async forRoot(configure: Configure): Promise<DynamicModule> {
        await configure.store('app.name');
        return {
            module: CoreModule,
            global: true,
            providers: [],
            exports: [],
            imports: [
                RedisModule.forRootAsync({
                    useFactory: async () => configure.get<RedisModuleOptions>('redis'),
                }),
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
                WinstonModule.forRoot({
                    level: process.env.LOG_LEVEL,
                    format: winston.format.combine(
                        winston.format.timestamp({
                            format: 'YYYY-MM-DD HH:mm:ss',
                        }),
                        winston.format.errors({ stack: true }),
                        winston.format.splat(),
                        winston.format.json(),
                    ),
                    defaultMeta: { service: 'log-service' },
                    transports: [
                        new winston.transports.File({
                            filename: process.env.LOG_ERROR_FILE,
                            level: 'error',
                        }),
                        new winston.transports.File({
                            filename: process.env.LOG_APP_FILE,
                        }),
                    ],
                }),
            ],
        };
    }
}
