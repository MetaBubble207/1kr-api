/**
 * 数据库配置
 */

import { ContentFactory } from '@/database/factories/content.factory';
import { UserFactory } from '@/database/factories/user.factory';
import ContentSeeder from '@/database/seeders/content.seeder';
import UserSeeder from '@/database/seeders/user.seeder';
import { createDbConfig } from '@/modules/database/helpers';

export const database = createDbConfig((configure) => ({
    common: {
        // synchronize: true,
    },
    connections: [
        {
            // 以下为mysql配置
            type: 'mysql',
            host: configure.env.get('DB_HOST', 'localhost'),
            port: configure.env.get('DB_PORT', 3306),
            username: configure.env.get('DB_USERNAME', 'root'),
            password: configure.env.get('DB_PASSWORD', ''),
            database: configure.env.get('DB_DATABASE', '1kti'),
            factories: [UserFactory, ContentFactory],
            seeders: [UserSeeder, ContentSeeder],
            // logging: 'all',
        },
        // {
        // 以下为sqlite配置
        // type: 'better-sqlite3',
        // database: resolve(__dirname, '../../database.db'),
        // },
    ],
}));
