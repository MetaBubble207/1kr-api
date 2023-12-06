/* eslint-disable import/no-import-module-exports */
import { MigrationInterface, QueryRunner } from 'typeorm';

class OzMhcl1701850576640 implements MigrationInterface {
    name = 'OzMhcl1701850576640';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`social_circle_followers\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`circleId\` varchar(36) NULL, INDEX \`idx_user_createdAt\` (\`userId\`, \`createdAt\`), INDEX \`idx_circel_createdAt\` (\`circleId\`, \`createdAt\`), UNIQUE INDEX \`uniq_circel_user\` (\`circleId\`, \`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_users\` ADD \`expiredTime\` int UNSIGNED NOT NULL COMMENT '到期时间戳' DEFAULT '0'`,
        );
        await queryRunner.query(
            `CREATE INDEX \`idx_user_createdAt\` ON \`social_circle_users\` (\`userId\`, \`createdAt\`)`,
        );
        await queryRunner.query(
            `CREATE INDEX \`idx_circel_createdAt\` ON \`social_circle_users\` (\`circleId\`, \`createdAt\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_followers\` ADD CONSTRAINT \`FK_91ad19a82446d6970edca26735d\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_followers\` ADD CONSTRAINT \`FK_d61891025f1e30d09c8ada36fd4\` FOREIGN KEY (\`circleId\`) REFERENCES \`social_circles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`social_circle_followers\` DROP FOREIGN KEY \`FK_d61891025f1e30d09c8ada36fd4\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_followers\` DROP FOREIGN KEY \`FK_91ad19a82446d6970edca26735d\``,
        );
        await queryRunner.query(`DROP INDEX \`idx_circel_createdAt\` ON \`social_circle_users\``);
        await queryRunner.query(`DROP INDEX \`idx_user_createdAt\` ON \`social_circle_users\``);
        await queryRunner.query(`ALTER TABLE \`social_circle_users\` DROP COLUMN \`expiredTime\``);
        await queryRunner.query(`DROP INDEX \`uniq_circel_user\` ON \`social_circle_followers\``);
        await queryRunner.query(
            `DROP INDEX \`idx_circel_createdAt\` ON \`social_circle_followers\``,
        );
        await queryRunner.query(`DROP INDEX \`idx_user_createdAt\` ON \`social_circle_followers\``);
        await queryRunner.query(`DROP TABLE \`social_circle_followers\``);
    }
}

module.exports = OzMhcl1701850576640;
