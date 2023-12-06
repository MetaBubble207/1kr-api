/* eslint-disable import/no-import-module-exports */
import { MigrationInterface, QueryRunner } from 'typeorm';

class ZSQpGS1701849195288 implements MigrationInterface {
    name = 'ZSQpGS1701849195288';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`social_circle_fees\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`type\` tinyint UNSIGNED NOT NULL COMMENT '收费类型,1月付,2季度付,3年付,4终身', \`amount\` int UNSIGNED NOT NULL COMMENT '费用', \`circleId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`tags\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` char(15) NOT NULL COMMENT '名称', UNIQUE INDEX \`uniq_name\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`social_circle_tags\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`tagId\` varchar(36) NULL, \`circleId\` varchar(36) NULL, UNIQUE INDEX \`uniq_circel_tag\` (\`circleId\`, \`tagId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circles\` ADD \`free\` tinyint NOT NULL COMMENT '是否免费'`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circles\` ADD \`followerCount\` int NOT NULL COMMENT '关注者数量'`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_users\` ADD \`expiredAt\` datetime NULL COMMENT '到期时间'`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_fees\` ADD CONSTRAINT \`FK_6205661867e19294cfcb83417d2\` FOREIGN KEY (\`circleId\`) REFERENCES \`social_circles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_tags\` ADD CONSTRAINT \`FK_33567f5c25b5374be1d879e350a\` FOREIGN KEY (\`tagId\`) REFERENCES \`tags\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_tags\` ADD CONSTRAINT \`FK_4e6272e984c1987329d2d08b604\` FOREIGN KEY (\`circleId\`) REFERENCES \`social_circles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`social_circle_tags\` DROP FOREIGN KEY \`FK_4e6272e984c1987329d2d08b604\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_tags\` DROP FOREIGN KEY \`FK_33567f5c25b5374be1d879e350a\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_fees\` DROP FOREIGN KEY \`FK_6205661867e19294cfcb83417d2\``,
        );
        await queryRunner.query(`ALTER TABLE \`social_circle_users\` DROP COLUMN \`expiredAt\``);
        await queryRunner.query(`ALTER TABLE \`social_circles\` DROP COLUMN \`followerCount\``);
        await queryRunner.query(`ALTER TABLE \`social_circles\` DROP COLUMN \`free\``);
        await queryRunner.query(`DROP INDEX \`uniq_circel_tag\` ON \`social_circle_tags\``);
        await queryRunner.query(`DROP TABLE \`social_circle_tags\``);
        await queryRunner.query(`DROP INDEX \`uniq_name\` ON \`tags\``);
        await queryRunner.query(`DROP TABLE \`tags\``);
        await queryRunner.query(`DROP TABLE \`social_circle_fees\``);
    }
}

module.exports = ZSQpGS1701849195288;
