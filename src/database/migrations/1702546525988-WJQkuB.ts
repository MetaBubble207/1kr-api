/* eslint-disable import/no-import-module-exports */
        import { MigrationInterface, QueryRunner } from "typeorm";

class WJQkuB1702546525988 implements MigrationInterface {
    name = 'WJQkuB1702546525988'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`feeds\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` varchar(255) NOT NULL COMMENT '用户ID', \`postId\` varchar(255) NOT NULL COMMENT '文章ID', \`circleId\` varchar(255) NOT NULL COMMENT '圈子ID', \`publishTime\` int UNSIGNED NOT NULL COMMENT '发布时间戳', INDEX \`idx_publishTime\` (\`userId\`, \`publishTime\`, \`postId\`), INDEX \`idx_circle_user\` (\`circleId\`, \`userId\`), UNIQUE INDEX \`uniq_user_post\` (\`userId\`, \`postId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`uniq_user_post\` ON \`feeds\``);
        await queryRunner.query(`DROP INDEX \`idx_circle_user\` ON \`feeds\``);
        await queryRunner.query(`DROP INDEX \`idx_publishTime\` ON \`feeds\``);
        await queryRunner.query(`DROP TABLE \`feeds\``);
    }

}

module.exports = WJQkuB1702546525988
