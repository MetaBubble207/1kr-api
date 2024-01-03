/* eslint-disable import/no-import-module-exports */
        import { MigrationInterface, QueryRunner } from "typeorm";

class UAnZeJ1704250062924 implements MigrationInterface {
    name = 'UAnZeJ1704250062924'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_4d8bb455f2abae849ebc8bc4ac\` ON \`user_wallet_recharge_records\``);
        await queryRunner.query(`ALTER TABLE \`user_wallet_withdraw_records\` ADD \`auditResult\` varchar(255) NOT NULL COMMENT '审核结果' DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`social_circle_sections\` CHANGE \`content\` \`content\` text NULL COMMENT '内容'`);
        await queryRunner.query(`ALTER TABLE \`social_circle_posts\` CHANGE \`content\` \`content\` text NULL COMMENT '内容'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`social_circle_posts\` CHANGE \`content\` \`content\` text NOT NULL COMMENT '内容'`);
        await queryRunner.query(`ALTER TABLE \`social_circle_sections\` CHANGE \`content\` \`content\` text NOT NULL COMMENT '内容'`);
        await queryRunner.query(`ALTER TABLE \`user_wallet_withdraw_records\` DROP COLUMN \`auditResult\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_4d8bb455f2abae849ebc8bc4ac\` ON \`user_wallet_recharge_records\` (\`orderId\`)`);
    }

}

module.exports = UAnZeJ1704250062924
