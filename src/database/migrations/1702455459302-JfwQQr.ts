/* eslint-disable import/no-import-module-exports */
import { MigrationInterface, QueryRunner } from 'typeorm';

class JfwQQr1702455459302 implements MigrationInterface {
    name = 'JfwQQr1702455459302';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`social_circle_posts\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '删除时间', \`title\` varchar(255) NOT NULL COMMENT '标题' DEFAULT '', \`content\` varchar(10000) NOT NULL COMMENT '内容' DEFAULT '', \`images\` varchar(255) NOT NULL COMMENT '图片路径,多个逗号分隔' DEFAULT '', \`videoUrl\` varchar(255) NOT NULL COMMENT '视频地址' DEFAULT '', \`commentCount\` int NOT NULL COMMENT '评论数' DEFAULT '0', \`likeCount\` int NOT NULL COMMENT '点赞数' DEFAULT '0', \`repostCount\` int NOT NULL COMMENT '转发数' DEFAULT '0', \`collectCount\` int NOT NULL COMMENT '收藏数' DEFAULT '0', \`userId\` varchar(36) NOT NULL, \`circleId\` varchar(36) NOT NULL, INDEX \`idx_circle_likeCount\` (\`circleId\`, \`likeCount\`), INDEX \`idx_circle_commentCount\` (\`circleId\`, \`commentCount\`), INDEX \`idx_circle_createdAt\` (\`circleId\`, \`createdAt\`), INDEX \`idx_user\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`collects\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '删除时间', \`title\` varchar(255) NOT NULL COMMENT '收藏夹名称', \`userId\` varchar(36) NOT NULL, INDEX \`idx_user\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`collect_posts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`remark\` varchar(255) NOT NULL COMMENT '备注' DEFAULT '', \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`collectId\` varchar(36) NULL, \`postId\` varchar(36) NULL, INDEX \`idx_collect\` (\`collectId\`, \`createdAt\`), UNIQUE INDEX \`uniq_collect_post\` (\`collectId\`, \`postId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`social_circle_post_likes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`postId\` varchar(36) NULL, INDEX \`idx_post\` (\`postId\`, \`createdAt\`), UNIQUE INDEX \`uniq_user_post\` (\`userId\`, \`postId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_posts\` ADD CONSTRAINT \`FK_ef9b9fe982802ea5a6407af59d9\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_posts\` ADD CONSTRAINT \`FK_5344660f04a1d8a44b52dbd5bd8\` FOREIGN KEY (\`circleId\`) REFERENCES \`social_circles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`collects\` ADD CONSTRAINT \`FK_1b3d95e3f902fc5f570e9707282\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`collect_posts\` ADD CONSTRAINT \`FK_4411804767a2b281de3ea78964e\` FOREIGN KEY (\`collectId\`) REFERENCES \`collects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`collect_posts\` ADD CONSTRAINT \`FK_6a5fd455e5473286061747998de\` FOREIGN KEY (\`postId\`) REFERENCES \`social_circle_posts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_post_likes\` ADD CONSTRAINT \`FK_7ad3480eff73fad2e4a9e652085\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_post_likes\` ADD CONSTRAINT \`FK_b1a8576b8b4aac096a782a3ed8f\` FOREIGN KEY (\`postId\`) REFERENCES \`social_circle_posts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`social_circle_post_likes\` DROP FOREIGN KEY \`FK_b1a8576b8b4aac096a782a3ed8f\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_post_likes\` DROP FOREIGN KEY \`FK_7ad3480eff73fad2e4a9e652085\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`collect_posts\` DROP FOREIGN KEY \`FK_6a5fd455e5473286061747998de\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`collect_posts\` DROP FOREIGN KEY \`FK_4411804767a2b281de3ea78964e\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`collects\` DROP FOREIGN KEY \`FK_1b3d95e3f902fc5f570e9707282\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_posts\` DROP FOREIGN KEY \`FK_5344660f04a1d8a44b52dbd5bd8\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_posts\` DROP FOREIGN KEY \`FK_ef9b9fe982802ea5a6407af59d9\``,
        );
        await queryRunner.query(`DROP INDEX \`uniq_user_post\` ON \`social_circle_post_likes\``);
        await queryRunner.query(`DROP INDEX \`idx_post\` ON \`social_circle_post_likes\``);
        await queryRunner.query(`DROP TABLE \`social_circle_post_likes\``);
        await queryRunner.query(`DROP INDEX \`uniq_collect_post\` ON \`collect_posts\``);
        await queryRunner.query(`DROP INDEX \`idx_collect\` ON \`collect_posts\``);
        await queryRunner.query(`DROP TABLE \`collect_posts\``);
        await queryRunner.query(`DROP INDEX \`idx_user\` ON \`collects\``);
        await queryRunner.query(`DROP TABLE \`collects\``);
        await queryRunner.query(`DROP INDEX \`idx_user\` ON \`social_circle_posts\``);
        await queryRunner.query(`DROP INDEX \`idx_circle_createdAt\` ON \`social_circle_posts\``);
        await queryRunner.query(
            `DROP INDEX \`idx_circle_commentCount\` ON \`social_circle_posts\``,
        );
        await queryRunner.query(`DROP INDEX \`idx_circle_likeCount\` ON \`social_circle_posts\``);
        await queryRunner.query(`DROP TABLE \`social_circle_posts\``);
    }
}

module.exports = JfwQQr1702455459302;
