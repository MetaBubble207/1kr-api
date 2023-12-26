/* eslint-disable import/no-import-module-exports */
import { MigrationInterface, QueryRunner } from 'typeorm';

class DqZYXb1703604509791 implements MigrationInterface {
    name = 'DqZYXb1703604509791';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`orders\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '删除时间', \`amount\` bigint UNSIGNED NOT NULL COMMENT '金额' DEFAULT '0', \`payType\` enum ('wechat', 'ali') NOT NULL COMMENT '支付方式', \`status\` enum ('toBePaid', 'paid', 'refund') NOT NULL COMMENT '状态', \`circleFee\` text NOT NULL COMMENT '圈子套餐快照', \`userId\` varchar(36) NOT NULL, \`circleId\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_wallet_recharge_records\` ADD \`orderId\` varchar(36) NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_wallet_recharge_records\` ADD UNIQUE INDEX \`IDX_4d8bb455f2abae849ebc8bc4ac\` (\`orderId\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_fees\` DROP FOREIGN KEY \`FK_6205661867e19294cfcb83417d2\``,
        );
        await queryRunner.query(`ALTER TABLE \`social_circle_fees\` DROP COLUMN \`type\``);
        await queryRunner.query(
            `ALTER TABLE \`social_circle_fees\` ADD \`type\` enum ('month', 'quarter', 'year', 'forever') NOT NULL COMMENT '收费类型,1月付,2季度付,3年付,4终身'`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_fees\` CHANGE \`circleId\` \`circleId\` varchar(36) NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_sections\` CHANGE \`content\` \`content\` text NOT NULL COMMENT '内容' DEFAULT ''`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_posts\` CHANGE \`content\` \`content\` text NOT NULL COMMENT '内容' DEFAULT ''`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX \`uniq_order\` ON \`user_wallet_recharge_records\` (\`orderId\`)`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX \`REL_4d8bb455f2abae849ebc8bc4ac\` ON \`user_wallet_recharge_records\` (\`orderId\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_fees\` ADD CONSTRAINT \`FK_6205661867e19294cfcb83417d2\` FOREIGN KEY (\`circleId\`) REFERENCES \`social_circles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_151b79a83ba240b0cb31b2302d1\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_fc0e4512da3648314d895da83c4\` FOREIGN KEY (\`circleId\`) REFERENCES \`social_circles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_wallet_recharge_records\` ADD CONSTRAINT \`FK_4d8bb455f2abae849ebc8bc4acf\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`user_wallet_recharge_records\` DROP FOREIGN KEY \`FK_4d8bb455f2abae849ebc8bc4acf\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_fc0e4512da3648314d895da83c4\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_151b79a83ba240b0cb31b2302d1\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_fees\` DROP FOREIGN KEY \`FK_6205661867e19294cfcb83417d2\``,
        );
        await queryRunner.query(
            `DROP INDEX \`REL_4d8bb455f2abae849ebc8bc4ac\` ON \`user_wallet_recharge_records\``,
        );
        await queryRunner.query(`DROP INDEX \`uniq_order\` ON \`user_wallet_recharge_records\``);
        await queryRunner.query(
            `ALTER TABLE \`social_circle_posts\` CHANGE \`content\` \`content\` text NOT NULL COMMENT '内容'`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_sections\` CHANGE \`content\` \`content\` text NOT NULL COMMENT '内容'`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_fees\` CHANGE \`circleId\` \`circleId\` varchar(36) NULL`,
        );
        await queryRunner.query(`ALTER TABLE \`social_circle_fees\` DROP COLUMN \`type\``);
        await queryRunner.query(
            `ALTER TABLE \`social_circle_fees\` ADD \`type\` tinyint UNSIGNED NOT NULL COMMENT '收费类型,1月付,2季度付,3年付,4终身'`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_fees\` ADD CONSTRAINT \`FK_6205661867e19294cfcb83417d2\` FOREIGN KEY (\`circleId\`) REFERENCES \`social_circles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_wallet_recharge_records\` DROP INDEX \`IDX_4d8bb455f2abae849ebc8bc4ac\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_wallet_recharge_records\` DROP COLUMN \`orderId\``,
        );
        await queryRunner.query(`DROP TABLE \`orders\``);
    }
}

module.exports = DqZYXb1703604509791;
