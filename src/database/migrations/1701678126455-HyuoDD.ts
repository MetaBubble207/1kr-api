/* eslint-disable import/no-import-module-exports */
import { MigrationInterface, QueryRunner } from 'typeorm';

class HyuoDD1701678126455 implements MigrationInterface {
    name = 'HyuoDD1701678126455';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`social_circles\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` char(15) NOT NULL COMMENT '名称', \`description\` varchar(255) NOT NULL COMMENT '描述', \`cover\` varchar(255) NOT NULL COMMENT '封面图片', \`bgImage\` varchar(255) NOT NULL COMMENT '背景图片', \`memberCount\` int NOT NULL COMMENT '成员数量', \`userId\` varchar(36) NOT NULL, INDEX \`idx_user\` (\`userId\`), UNIQUE INDEX \`uniq_name\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`social_circle_users\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`circleId\` varchar(36) NULL, UNIQUE INDEX \`uniq_circel_user\` (\`circleId\`, \`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circles\` ADD CONSTRAINT \`FK_193c83ce6d4caa380cebdba8042\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_users\` ADD CONSTRAINT \`FK_aad9509ac5cf2026fa7aa11b3d7\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_users\` ADD CONSTRAINT \`FK_2d91f37f4b36b8b3fd9dd99f787\` FOREIGN KEY (\`circleId\`) REFERENCES \`social_circles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`social_circle_users\` DROP FOREIGN KEY \`FK_2d91f37f4b36b8b3fd9dd99f787\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_users\` DROP FOREIGN KEY \`FK_aad9509ac5cf2026fa7aa11b3d7\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circles\` DROP FOREIGN KEY \`FK_193c83ce6d4caa380cebdba8042\``,
        );
        await queryRunner.query(`DROP INDEX \`uniq_circel_user\` ON \`social_circle_users\``);
        await queryRunner.query(`DROP TABLE \`social_circle_users\``);
        await queryRunner.query(`DROP INDEX \`uniq_name\` ON \`social_circles\``);
        await queryRunner.query(`DROP INDEX \`idx_user\` ON \`social_circles\``);
        await queryRunner.query(`DROP TABLE \`social_circles\``);
    }
}

module.exports = HyuoDD1701678126455;
