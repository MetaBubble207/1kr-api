/* eslint-disable import/no-import-module-exports */
        import { MigrationInterface, QueryRunner } from "typeorm";

class Hfczyo1701850603212 implements MigrationInterface {
    name = 'Hfczyo1701850603212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`social_circle_users\` DROP COLUMN \`expiredAt\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`social_circle_users\` ADD \`expiredAt\` datetime NULL COMMENT '到期时间'`);
    }

}

module.exports = Hfczyo1701850603212
