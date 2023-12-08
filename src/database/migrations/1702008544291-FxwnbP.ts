/* eslint-disable import/no-import-module-exports */
        import { MigrationInterface, QueryRunner } from "typeorm";

class FxwnbP1702008544291 implements MigrationInterface {
    name = 'FxwnbP1702008544291'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`chat_messages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`circleId\` char(36) NOT NULL COMMENT '圈子ID', \`userId\` char(36) NOT NULL COMMENT '用户ID', \`type\` varchar(255) NOT NULL COMMENT '消息类型' DEFAULT 'text', \`content\` varchar(10000) NOT NULL COMMENT '内容', \`parentId\` int UNSIGNED NOT NULL COMMENT '引用ID' DEFAULT '0', \`sendTime\` int UNSIGNED NOT NULL COMMENT '发送时间戳' DEFAULT '0', INDEX \`idx_circle_sendTime\` (\`circleId\`, \`sendTime\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`idx_circle_sendTime\` ON \`chat_messages\``);
        await queryRunner.query(`DROP TABLE \`chat_messages\``);
    }

}

module.exports = FxwnbP1702008544291
