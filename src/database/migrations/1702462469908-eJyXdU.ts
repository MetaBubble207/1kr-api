/* eslint-disable import/no-import-module-exports */
        import { MigrationInterface, QueryRunner } from "typeorm";

class EJyXdU1702462469908 implements MigrationInterface {
    name = 'EJyXdU1702462469908'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`social_circle_posts\` DROP COLUMN \`images\``);
        await queryRunner.query(`ALTER TABLE \`social_circle_posts\` DROP COLUMN \`videoUrl\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`social_circle_posts\` ADD \`videoUrl\` varchar(255) NOT NULL COMMENT '视频地址' DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`social_circle_posts\` ADD \`images\` varchar(255) NOT NULL COMMENT '图片路径,多个逗号分隔' DEFAULT ''`);
    }

}

module.exports = EJyXdU1702462469908
