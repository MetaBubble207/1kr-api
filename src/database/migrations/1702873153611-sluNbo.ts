/* eslint-disable import/no-import-module-exports */
        import { MigrationInterface, QueryRunner } from "typeorm";

class SluNbo1702873153611 implements MigrationInterface {
    name = 'SluNbo1702873153611'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`social_circle_courses\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '删除时间', \`title\` varchar(255) NOT NULL COMMENT '标题' DEFAULT '', \`description\` varchar(10000) NOT NULL COMMENT '介绍' DEFAULT '', \`cover\` varchar(255) NOT NULL COMMENT '封面图', \`qa\` tinyint NOT NULL COMMENT '问答模块是否开启' DEFAULT 0, \`circleId\` varchar(36) NOT NULL, INDEX \`idx_circle_createdAt\` (\`circleId\`, \`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`social_circle_sections\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '删除时间', \`title\` varchar(255) NOT NULL COMMENT '标题' DEFAULT '', \`content\` text NOT NULL COMMENT '内容' DEFAULT '', \`free\` tinyint NOT NULL COMMENT '是否可试看' DEFAULT 0, \`duration\` int UNSIGNED NOT NULL COMMENT '时长' DEFAULT '0', \`chapterId\` varchar(36) NOT NULL, INDEX \`idx_chapter_createdAt\` (\`chapterId\`, \`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`social_circle_chapters\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '删除时间', \`title\` varchar(255) NOT NULL COMMENT '标题' DEFAULT '', \`courseId\` varchar(36) NOT NULL, INDEX \`idx_course_createdAt\` (\`courseId\`, \`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comment_upvoters\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`commentId\` int NULL, INDEX \`idx_comment\` (\`commentId\`, \`createdAt\`), UNIQUE INDEX \`uniq_user_comment\` (\`userId\`, \`commentId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comment_downvoters\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`commentId\` int NULL, INDEX \`idx_comment\` (\`commentId\`, \`createdAt\`), UNIQUE INDEX \`uniq_user_comment\` (\`userId\`, \`commentId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`social_circle_posts\` ADD \`business\` enum ('feed', 'forum', 'course') NOT NULL COMMENT '业务'`);
        await queryRunner.query(`ALTER TABLE \`social_circle_posts\` ADD \`sectionId\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`social_circle_posts\` ADD \`disableComment\` tinyint NOT NULL COMMENT '是否禁止新评论' DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD \`upvoteCount\` int NOT NULL COMMENT '赞成票数' DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD \`downvoteCount\` int NOT NULL COMMENT '反对票数' DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD \`best\` tinyint NOT NULL COMMENT '是否是最佳答案' DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`social_circle_posts\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`social_circle_posts\` ADD \`content\` text NOT NULL COMMENT '内容' DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`comments\` CHANGE \`content\` \`content\` varchar(255) NOT NULL COMMENT '内容' DEFAULT ''`);
        await queryRunner.query(`CREATE INDEX \`idx_circle_section_createdAt\` ON \`social_circle_posts\` (\`circleId\`, \`sectionId\`, \`createdAt\`)`);
        await queryRunner.query(`CREATE INDEX \`idx_user\` ON \`comments\` (\`userId\`, \`createdAt\`)`);
        await queryRunner.query(`CREATE INDEX \`idx_post\` ON \`comments\` (\`postId\`, \`createdAt\`)`);
        await queryRunner.query(`ALTER TABLE \`social_circle_courses\` ADD CONSTRAINT \`FK_afd03c5ed6f96086b7efaf05b29\` FOREIGN KEY (\`circleId\`) REFERENCES \`social_circles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`social_circle_sections\` ADD CONSTRAINT \`FK_ec9ab5fe4a56e1c7d502c73f75b\` FOREIGN KEY (\`chapterId\`) REFERENCES \`social_circle_chapters\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`social_circle_chapters\` ADD CONSTRAINT \`FK_dab501dcf3e1e27ac975df3a029\` FOREIGN KEY (\`courseId\`) REFERENCES \`social_circle_courses\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`social_circle_posts\` ADD CONSTRAINT \`FK_6b155bf4416ef5eeb9ffa9345a6\` FOREIGN KEY (\`sectionId\`) REFERENCES \`social_circle_sections\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment_upvoters\` ADD CONSTRAINT \`FK_b47c89751a0936881936ff78527\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment_upvoters\` ADD CONSTRAINT \`FK_79d76a35b2855320c5b79337bff\` FOREIGN KEY (\`commentId\`) REFERENCES \`comments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment_downvoters\` ADD CONSTRAINT \`FK_b0fe125ee2d06fd59588cb14218\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment_downvoters\` ADD CONSTRAINT \`FK_3e17e94446b67519d01bdac443d\` FOREIGN KEY (\`commentId\`) REFERENCES \`comments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comment_downvoters\` DROP FOREIGN KEY \`FK_3e17e94446b67519d01bdac443d\``);
        await queryRunner.query(`ALTER TABLE \`comment_downvoters\` DROP FOREIGN KEY \`FK_b0fe125ee2d06fd59588cb14218\``);
        await queryRunner.query(`ALTER TABLE \`comment_upvoters\` DROP FOREIGN KEY \`FK_79d76a35b2855320c5b79337bff\``);
        await queryRunner.query(`ALTER TABLE \`comment_upvoters\` DROP FOREIGN KEY \`FK_b47c89751a0936881936ff78527\``);
        await queryRunner.query(`ALTER TABLE \`social_circle_posts\` DROP FOREIGN KEY \`FK_6b155bf4416ef5eeb9ffa9345a6\``);
        await queryRunner.query(`ALTER TABLE \`social_circle_chapters\` DROP FOREIGN KEY \`FK_dab501dcf3e1e27ac975df3a029\``);
        await queryRunner.query(`ALTER TABLE \`social_circle_sections\` DROP FOREIGN KEY \`FK_ec9ab5fe4a56e1c7d502c73f75b\``);
        await queryRunner.query(`ALTER TABLE \`social_circle_courses\` DROP FOREIGN KEY \`FK_afd03c5ed6f96086b7efaf05b29\``);
        await queryRunner.query(`DROP INDEX \`idx_post\` ON \`comments\``);
        await queryRunner.query(`DROP INDEX \`idx_user\` ON \`comments\``);
        await queryRunner.query(`DROP INDEX \`idx_circle_section_createdAt\` ON \`social_circle_posts\``);
        await queryRunner.query(`ALTER TABLE \`comments\` CHANGE \`content\` \`content\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`social_circle_posts\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`social_circle_posts\` ADD \`content\` varchar(10000) NOT NULL COMMENT '内容' DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN \`best\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN \`downvoteCount\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN \`upvoteCount\``);
        await queryRunner.query(`ALTER TABLE \`social_circle_posts\` DROP COLUMN \`disableComment\``);
        await queryRunner.query(`ALTER TABLE \`social_circle_posts\` DROP COLUMN \`sectionId\``);
        await queryRunner.query(`ALTER TABLE \`social_circle_posts\` DROP COLUMN \`business\``);
        await queryRunner.query(`DROP INDEX \`uniq_user_comment\` ON \`comment_downvoters\``);
        await queryRunner.query(`DROP INDEX \`idx_comment\` ON \`comment_downvoters\``);
        await queryRunner.query(`DROP TABLE \`comment_downvoters\``);
        await queryRunner.query(`DROP INDEX \`uniq_user_comment\` ON \`comment_upvoters\``);
        await queryRunner.query(`DROP INDEX \`idx_comment\` ON \`comment_upvoters\``);
        await queryRunner.query(`DROP TABLE \`comment_upvoters\``);
        await queryRunner.query(`DROP INDEX \`idx_course_createdAt\` ON \`social_circle_chapters\``);
        await queryRunner.query(`DROP TABLE \`social_circle_chapters\``);
        await queryRunner.query(`DROP INDEX \`idx_chapter_createdAt\` ON \`social_circle_sections\``);
        await queryRunner.query(`DROP TABLE \`social_circle_sections\``);
        await queryRunner.query(`DROP INDEX \`idx_circle_createdAt\` ON \`social_circle_courses\``);
        await queryRunner.query(`DROP TABLE \`social_circle_courses\``);
    }

}

module.exports = SluNbo1702873153611
