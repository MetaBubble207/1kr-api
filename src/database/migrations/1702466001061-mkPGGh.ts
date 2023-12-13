/* eslint-disable import/no-import-module-exports */
        import { MigrationInterface, QueryRunner } from "typeorm";

class MkPGGh1702466001061 implements MigrationInterface {
    name = 'MkPGGh1702466001061'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`comments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '删除时间', \`content\` varchar(255) NOT NULL, \`likeCount\` int NOT NULL COMMENT '点赞数' DEFAULT '0', \`replyCount\` int NOT NULL COMMENT '回复数量，只有根节点存储该值' DEFAULT '0', \`mpath\` varchar(255) NULL DEFAULT '', \`postId\` varchar(36) NOT NULL, \`userId\` varchar(36) NOT NULL, \`parentId\` int NULL, INDEX \`IDX_e44ddaaa6d058cb4092f83ad61\` (\`postId\`), INDEX \`IDX_7e8d7c49f218ebb14314fdb374\` (\`userId\`), INDEX \`IDX_862fb408f6b9a0df8eb1266f73\` (\`likeCount\`), INDEX \`IDX_2389ec85813736a9a0ec6c080a\` (\`replyCount\`), INDEX \`idx_mpath\` (\`mpath\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comment_likes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`commentId\` int NULL, INDEX \`idx_comment\` (\`commentId\`, \`createdAt\`), UNIQUE INDEX \`uniq_user_comment\` (\`userId\`, \`commentId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_e44ddaaa6d058cb4092f83ad61f\` FOREIGN KEY (\`postId\`) REFERENCES \`social_circle_posts\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_7e8d7c49f218ebb14314fdb3749\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_8770bd9030a3d13c5f79a7d2e81\` FOREIGN KEY (\`parentId\`) REFERENCES \`comments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment_likes\` ADD CONSTRAINT \`FK_34d1f902a8a527dbc2502f87c88\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment_likes\` ADD CONSTRAINT \`FK_abbd506a94a424dd6a3a68d26f4\` FOREIGN KEY (\`commentId\`) REFERENCES \`comments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comment_likes\` DROP FOREIGN KEY \`FK_abbd506a94a424dd6a3a68d26f4\``);
        await queryRunner.query(`ALTER TABLE \`comment_likes\` DROP FOREIGN KEY \`FK_34d1f902a8a527dbc2502f87c88\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_8770bd9030a3d13c5f79a7d2e81\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_7e8d7c49f218ebb14314fdb3749\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_e44ddaaa6d058cb4092f83ad61f\``);
        await queryRunner.query(`DROP INDEX \`uniq_user_comment\` ON \`comment_likes\``);
        await queryRunner.query(`DROP INDEX \`idx_comment\` ON \`comment_likes\``);
        await queryRunner.query(`DROP TABLE \`comment_likes\``);
        await queryRunner.query(`DROP INDEX \`idx_mpath\` ON \`comments\``);
        await queryRunner.query(`DROP INDEX \`IDX_2389ec85813736a9a0ec6c080a\` ON \`comments\``);
        await queryRunner.query(`DROP INDEX \`IDX_862fb408f6b9a0df8eb1266f73\` ON \`comments\``);
        await queryRunner.query(`DROP INDEX \`IDX_7e8d7c49f218ebb14314fdb374\` ON \`comments\``);
        await queryRunner.query(`DROP INDEX \`IDX_e44ddaaa6d058cb4092f83ad61\` ON \`comments\``);
        await queryRunner.query(`DROP TABLE \`comments\``);
    }

}

module.exports = MkPGGh1702466001061
