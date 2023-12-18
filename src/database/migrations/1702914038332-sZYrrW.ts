/* eslint-disable import/no-import-module-exports */
        import { MigrationInterface, QueryRunner } from "typeorm";

class SZYrrW1702914038332 implements MigrationInterface {
    name = 'SZYrrW1702914038332'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`social_circle_courses\` ADD \`online\` tinyint NOT NULL COMMENT '是否上线' DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`social_circle_sections\` ADD \`online\` tinyint NOT NULL COMMENT '是否上线' DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`social_circle_sections\` ADD \`sequence\` int NOT NULL COMMENT '索引' DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`social_circle_chapters\` ADD \`sequence\` int NOT NULL COMMENT '索引' DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`social_circle_chapters\` ADD \`online\` tinyint NOT NULL COMMENT '是否上线' DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`social_circle_sections\` CHANGE \`content\` \`content\` text NOT NULL COMMENT '内容' DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`social_circle_posts\` CHANGE \`content\` \`content\` text NOT NULL COMMENT '内容' DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`social_circle_posts\` CHANGE \`content\` \`content\` text NOT NULL COMMENT '内容'`);
        await queryRunner.query(`ALTER TABLE \`social_circle_sections\` CHANGE \`content\` \`content\` text NOT NULL COMMENT '内容'`);
        await queryRunner.query(`ALTER TABLE \`social_circle_chapters\` DROP COLUMN \`online\``);
        await queryRunner.query(`ALTER TABLE \`social_circle_chapters\` DROP COLUMN \`sequence\``);
        await queryRunner.query(`ALTER TABLE \`social_circle_sections\` DROP COLUMN \`sequence\``);
        await queryRunner.query(`ALTER TABLE \`social_circle_sections\` DROP COLUMN \`online\``);
        await queryRunner.query(`ALTER TABLE \`social_circle_courses\` DROP COLUMN \`online\``);
    }

}

module.exports = SZYrrW1702914038332
