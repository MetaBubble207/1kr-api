/* eslint-disable import/no-import-module-exports */
import { MigrationInterface, QueryRunner } from 'typeorm';

class KIdNNa1703581321403 implements MigrationInterface {
    name = 'KIdNNa1703581321403';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`user_wallet_recharge_records\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '删除时间', \`amount\` bigint UNSIGNED NOT NULL COMMENT '金额' DEFAULT '0', \`status\` enum ('success') NOT NULL COMMENT '状态', \`userId\` varchar(36) NOT NULL, INDEX \`idx_user\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`user_wallet_trans_records\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '删除时间', \`amount\` bigint UNSIGNED NOT NULL COMMENT '金额' DEFAULT '0', \`beforeBalance\` bigint UNSIGNED NOT NULL COMMENT '变动前余额' DEFAULT '0', \`afterBalance\` bigint UNSIGNED NOT NULL COMMENT '变动后余额' DEFAULT '0', \`type\` enum ('recharge', 'joinCircle', 'joinCircleIncome', 'withdraw', 'reward', 'refund') NOT NULL COMMENT '类型', \`userId\` varchar(36) NOT NULL, INDEX \`idx_user_type\` (\`userId\`, \`type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`user_wallet\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`amount\` bigint UNSIGNED NOT NULL COMMENT '余额' DEFAULT '0', \`userId\` varchar(36) NOT NULL, UNIQUE INDEX \`REL_f470cbcba8c6dbdaf32ac0d426\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`user_wallet_withdraw_records\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '删除时间', \`amount\` bigint UNSIGNED NOT NULL COMMENT '金额' DEFAULT '0', \`fee\` bigint UNSIGNED NOT NULL COMMENT '提现手续费' DEFAULT '0', \`feeRate\` decimal(10,2) NOT NULL COMMENT '提现手续费率' DEFAULT '0.00', \`status\` enum ('pending', 'auditPass', 'auditFailed', 'transSuccess', 'transFailed') NOT NULL COMMENT '状态', \`userId\` varchar(36) NOT NULL, INDEX \`idx_user\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_sections\` CHANGE \`content\` \`content\` text NOT NULL COMMENT '内容' DEFAULT ''`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_posts\` CHANGE \`content\` \`content\` text NOT NULL COMMENT '内容' DEFAULT ''`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_wallet_recharge_records\` ADD CONSTRAINT \`FK_3374e8ea669e0319d8f3e172fe2\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_wallet_trans_records\` ADD CONSTRAINT \`FK_3bd1342047e94e8fb5fc14d15ae\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_wallet\` ADD CONSTRAINT \`FK_f470cbcba8c6dbdaf32ac0d4267\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_wallet_withdraw_records\` ADD CONSTRAINT \`FK_5300e620769084aff9d10fdbe63\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`user_wallet_withdraw_records\` DROP FOREIGN KEY \`FK_5300e620769084aff9d10fdbe63\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_wallet\` DROP FOREIGN KEY \`FK_f470cbcba8c6dbdaf32ac0d4267\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_wallet_trans_records\` DROP FOREIGN KEY \`FK_3bd1342047e94e8fb5fc14d15ae\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_wallet_recharge_records\` DROP FOREIGN KEY \`FK_3374e8ea669e0319d8f3e172fe2\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_posts\` CHANGE \`content\` \`content\` text NOT NULL COMMENT '内容'`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_sections\` CHANGE \`content\` \`content\` text NOT NULL COMMENT '内容'`,
        );
        await queryRunner.query(`DROP INDEX \`idx_user\` ON \`user_wallet_withdraw_records\``);
        await queryRunner.query(`DROP TABLE \`user_wallet_withdraw_records\``);
        await queryRunner.query(`DROP INDEX \`REL_f470cbcba8c6dbdaf32ac0d426\` ON \`user_wallet\``);
        await queryRunner.query(`DROP TABLE \`user_wallet\``);
        await queryRunner.query(`DROP INDEX \`idx_user_type\` ON \`user_wallet_trans_records\``);
        await queryRunner.query(`DROP TABLE \`user_wallet_trans_records\``);
        await queryRunner.query(`DROP INDEX \`idx_user\` ON \`user_wallet_recharge_records\``);
        await queryRunner.query(`DROP TABLE \`user_wallet_recharge_records\``);
    }
}

module.exports = KIdNNa1703581321403;
