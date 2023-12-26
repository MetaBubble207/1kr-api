/* eslint-disable import/no-import-module-exports */
import { MigrationInterface, QueryRunner } from 'typeorm';

class AtkXQZ1703563311003 implements MigrationInterface {
    name = 'AtkXQZ1703563311003';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`content_comments\` (\`id\` varchar(36) NOT NULL, \`body\` text NOT NULL COMMENT '评论内容', \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`mpath\` varchar(255) NULL DEFAULT '', \`parentId\` varchar(36) NULL, \`postId\` varchar(36) NOT NULL, FULLTEXT INDEX \`IDX_5f70a0489331d4346e46ea4d88\` (\`body\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`content_tags\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL COMMENT '分类名称', \`description\` varchar(255) NULL COMMENT '标签描述', \`deletedAt\` datetime(6) NULL COMMENT '删除时间', FULLTEXT INDEX \`IDX_6f504a08a58010e15c55b1eb23\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`content_posts\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL COMMENT '文章标题', \`body\` text NOT NULL COMMENT '文章内容', \`summary\` varchar(255) NULL COMMENT '文章描述', \`keywords\` text NULL COMMENT '关键字', \`type\` varchar(255) NOT NULL COMMENT '文章类型' DEFAULT 'markdown', \`publishedAt\` varchar(255) NULL COMMENT '发布时间', \`customOrder\` int NOT NULL COMMENT '自定义文章排序' DEFAULT '0', \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '删除时间', \`categoryId\` varchar(36) NULL, FULLTEXT INDEX \`IDX_9ef6db9d13df6882d36c8af0cc\` (\`title\`), FULLTEXT INDEX \`IDX_e51068c39974ca11fae5d44c88\` (\`body\`), FULLTEXT INDEX \`IDX_f43723dc196c18767a3893a3f7\` (\`summary\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`content_categories\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL COMMENT '分类名称', \`customOrder\` int NOT NULL COMMENT '分类排序' DEFAULT '0', \`deletedAt\` datetime(6) NULL COMMENT '删除时间', \`mpath\` varchar(255) NULL DEFAULT '', \`parentId\` varchar(36) NULL, FULLTEXT INDEX \`IDX_d6aaf8517ca57297a8c3a44d3d\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`user_refresh_tokens\` (\`id\` varchar(36) NOT NULL, \`value\` varchar(500) NOT NULL, \`expired_at\` datetime NOT NULL COMMENT '令牌过期时间', \`createdAt\` datetime(6) NOT NULL COMMENT '令牌创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`accessTokenId\` varchar(36) NULL, UNIQUE INDEX \`REL_1dfd080c2abf42198691b60ae3\` (\`accessTokenId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`nickname\` varchar(255) NULL COMMENT '姓名', \`username\` varchar(255) NOT NULL COMMENT '用户名', \`password\` varchar(500) NOT NULL COMMENT '密码', \`phone\` varchar(255) NULL COMMENT '手机号', \`email\` varchar(255) NULL COMMENT '邮箱', \`createdAt\` datetime(6) NOT NULL COMMENT '用户创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '用户更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '删除时间', UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), UNIQUE INDEX \`IDX_a000cca60bcf04454e72769949\` (\`phone\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`user_access_tokens\` (\`id\` varchar(36) NOT NULL, \`value\` varchar(500) NOT NULL, \`expired_at\` datetime NOT NULL COMMENT '令牌过期时间', \`createdAt\` datetime(6) NOT NULL COMMENT '令牌创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`chat_messages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`circleId\` char(36) NOT NULL COMMENT '圈子ID', \`userId\` char(36) NOT NULL COMMENT '用户ID', \`type\` varchar(255) NOT NULL COMMENT '消息类型' DEFAULT 'text', \`content\` varchar(10000) NOT NULL COMMENT '内容', \`parentId\` int UNSIGNED NOT NULL COMMENT '引用ID' DEFAULT '0', \`sendTime\` int UNSIGNED NOT NULL COMMENT '发送时间戳' DEFAULT '0', INDEX \`idx_circle_sendTime\` (\`circleId\`, \`sendTime\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`tags\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` char(15) NOT NULL COMMENT '名称', UNIQUE INDEX \`uniq_name\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`social_circle_tags\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`tagId\` varchar(36) NULL, \`circleId\` varchar(36) NULL, UNIQUE INDEX \`uniq_circel_tag\` (\`circleId\`, \`tagId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`social_circles\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`free\` tinyint NOT NULL COMMENT '是否免费', \`name\` char(15) NOT NULL COMMENT '名称', \`description\` varchar(255) NOT NULL COMMENT '描述', \`cover\` varchar(255) NOT NULL COMMENT '封面图片', \`bgImage\` varchar(255) NOT NULL COMMENT '背景图片', \`memberCount\` int NOT NULL COMMENT '成员数量', \`followerCount\` int NOT NULL COMMENT '关注者数量', \`userId\` varchar(36) NOT NULL, INDEX \`idx_user\` (\`userId\`), UNIQUE INDEX \`uniq_name\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`social_circle_users\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`expiredTime\` int UNSIGNED NOT NULL COMMENT '到期时间戳' DEFAULT '0', \`userId\` varchar(36) NULL, \`circleId\` varchar(36) NULL, INDEX \`idx_user_createdAt\` (\`userId\`, \`createdAt\`), INDEX \`idx_circel_createdAt\` (\`circleId\`, \`createdAt\`), UNIQUE INDEX \`uniq_circel_user\` (\`circleId\`, \`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`social_circle_fees\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`type\` tinyint UNSIGNED NOT NULL COMMENT '收费类型,1月付,2季度付,3年付,4终身', \`amount\` int UNSIGNED NOT NULL COMMENT '费用', \`circleId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`social_circle_followers\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`circleId\` varchar(36) NULL, INDEX \`idx_user_createdAt\` (\`userId\`, \`createdAt\`), INDEX \`idx_circel_createdAt\` (\`circleId\`, \`createdAt\`), UNIQUE INDEX \`uniq_circel_user\` (\`circleId\`, \`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`comments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '删除时间', \`content\` varchar(255) NOT NULL COMMENT '内容' DEFAULT '', \`likeCount\` int NOT NULL COMMENT '点赞数' DEFAULT '0', \`replyCount\` int NOT NULL COMMENT '回复数量，只有根节点存储该值' DEFAULT '0', \`upvoteCount\` int NOT NULL COMMENT '赞成票数' DEFAULT '0', \`downvoteCount\` int NOT NULL COMMENT '反对票数' DEFAULT '0', \`best\` tinyint NOT NULL COMMENT '是否是最佳答案' DEFAULT 0, \`mpath\` varchar(255) NULL DEFAULT '', \`postId\` varchar(36) NOT NULL, \`userId\` varchar(36) NOT NULL, \`parentId\` int NULL, INDEX \`IDX_e44ddaaa6d058cb4092f83ad61\` (\`postId\`), INDEX \`IDX_7e8d7c49f218ebb14314fdb374\` (\`userId\`), INDEX \`idx_user\` (\`userId\`, \`createdAt\`), INDEX \`idx_post\` (\`postId\`, \`createdAt\`), INDEX \`idx_mpath\` (\`mpath\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`comment_likes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`commentId\` int NULL, INDEX \`idx_comment\` (\`commentId\`, \`createdAt\`), UNIQUE INDEX \`uniq_user_comment\` (\`userId\`, \`commentId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`social_circle_post_likes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`postId\` varchar(36) NULL, INDEX \`idx_post\` (\`postId\`, \`createdAt\`), UNIQUE INDEX \`uniq_user_post\` (\`userId\`, \`postId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`social_circle_courses\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '删除时间', \`title\` varchar(255) NOT NULL COMMENT '标题' DEFAULT '', \`description\` varchar(10000) NOT NULL COMMENT '介绍' DEFAULT '', \`cover\` varchar(255) NOT NULL COMMENT '封面图', \`qa\` tinyint NOT NULL COMMENT '问答模块是否开启' DEFAULT 0, \`online\` tinyint NOT NULL COMMENT '是否上线' DEFAULT 0, \`circleId\` varchar(36) NOT NULL, INDEX \`idx_circle_createdAt\` (\`circleId\`, \`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`social_circle_sections\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '删除时间', \`title\` varchar(255) NOT NULL COMMENT '标题' DEFAULT '', \`content\` text NOT NULL COMMENT '内容' DEFAULT '', \`free\` tinyint NOT NULL COMMENT '是否可试看' DEFAULT 0, \`duration\` int UNSIGNED NOT NULL COMMENT '时长' DEFAULT '0', \`online\` tinyint NOT NULL COMMENT '是否上线' DEFAULT 0, \`sequence\` int NOT NULL COMMENT '索引' DEFAULT '1', \`chapterId\` varchar(36) NOT NULL, INDEX \`idx_chapter_createdAt\` (\`chapterId\`, \`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`social_circle_chapters\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '删除时间', \`title\` varchar(255) NOT NULL COMMENT '标题' DEFAULT '', \`sequence\` int NOT NULL COMMENT '索引' DEFAULT '1', \`online\` tinyint NOT NULL COMMENT '是否上线' DEFAULT 0, \`courseId\` varchar(36) NOT NULL, INDEX \`idx_course_createdAt\` (\`courseId\`, \`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`social_circle_posts\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '删除时间', \`business\` enum ('feed', 'forum', 'course') NOT NULL COMMENT '业务', \`sectionId\` varchar(255) NOT NULL DEFAULT '', \`title\` varchar(255) NOT NULL COMMENT '标题' DEFAULT '', \`content\` text NOT NULL COMMENT '内容' DEFAULT '', \`commentCount\` int NOT NULL COMMENT '评论数' DEFAULT '0', \`likeCount\` int NOT NULL COMMENT '点赞数' DEFAULT '0', \`repostCount\` int NOT NULL COMMENT '转发数' DEFAULT '0', \`collectCount\` int NOT NULL COMMENT '收藏数' DEFAULT '0', \`disableComment\` tinyint NOT NULL COMMENT '是否禁止新评论' DEFAULT 0, \`userId\` varchar(36) NOT NULL, \`circleId\` varchar(36) NOT NULL, INDEX \`idx_circle_likeCount\` (\`circleId\`, \`likeCount\`), INDEX \`idx_circle_commentCount\` (\`circleId\`, \`commentCount\`), INDEX \`idx_circle_section_createdAt\` (\`circleId\`, \`sectionId\`, \`createdAt\`), INDEX \`idx_circle_createdAt\` (\`circleId\`, \`createdAt\`), INDEX \`idx_user\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`collects\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '删除时间', \`title\` varchar(255) NOT NULL COMMENT '收藏夹名称', \`userId\` varchar(36) NOT NULL, INDEX \`idx_user\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`collect_posts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`remark\` varchar(255) NOT NULL COMMENT '备注' DEFAULT '', \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`collectId\` varchar(36) NULL, \`postId\` varchar(36) NULL, INDEX \`idx_collect\` (\`collectId\`, \`createdAt\`), UNIQUE INDEX \`uniq_collect_post\` (\`collectId\`, \`postId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`comment_upvoters\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`commentId\` int NULL, INDEX \`idx_comment\` (\`commentId\`, \`createdAt\`), UNIQUE INDEX \`uniq_user_comment\` (\`userId\`, \`commentId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`comment_downvoters\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`commentId\` int NULL, INDEX \`idx_comment\` (\`commentId\`, \`createdAt\`), UNIQUE INDEX \`uniq_user_comment\` (\`userId\`, \`commentId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`feeds\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` varchar(255) NOT NULL COMMENT '用户ID', \`postId\` varchar(255) NOT NULL COMMENT '文章ID', \`circleId\` varchar(255) NOT NULL COMMENT '圈子ID', \`publishTime\` int UNSIGNED NOT NULL COMMENT '发布时间戳', INDEX \`idx_publishTime\` (\`userId\`, \`publishTime\`, \`postId\`), INDEX \`idx_circle_user\` (\`circleId\`, \`userId\`), UNIQUE INDEX \`uniq_user_post\` (\`userId\`, \`postId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`content_posts_tags_content_tags\` (\`contentPostsId\` varchar(36) NOT NULL, \`contentTagsId\` varchar(36) NOT NULL, INDEX \`IDX_1e8c41827d0d509e70de1f6b70\` (\`contentPostsId\`), INDEX \`IDX_888e6754015ee17f9e22faae57\` (\`contentTagsId\`), PRIMARY KEY (\`contentPostsId\`, \`contentTagsId\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE \`content_comments\` ADD CONSTRAINT \`FK_982a849f676860e5d6beb607f20\` FOREIGN KEY (\`parentId\`) REFERENCES \`content_comments\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`content_comments\` ADD CONSTRAINT \`FK_5e1c3747a0031f305e94493361f\` FOREIGN KEY (\`postId\`) REFERENCES \`content_posts\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`content_posts\` ADD CONSTRAINT \`FK_4027367881933f659d02f367e92\` FOREIGN KEY (\`categoryId\`) REFERENCES \`content_categories\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`content_categories\` ADD CONSTRAINT \`FK_a03aea27707893300382b6f18ae\` FOREIGN KEY (\`parentId\`) REFERENCES \`content_categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_refresh_tokens\` ADD CONSTRAINT \`FK_1dfd080c2abf42198691b60ae39\` FOREIGN KEY (\`accessTokenId\`) REFERENCES \`user_access_tokens\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_access_tokens\` ADD CONSTRAINT \`FK_71a030e491d5c8547fc1e38ef82\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_tags\` ADD CONSTRAINT \`FK_33567f5c25b5374be1d879e350a\` FOREIGN KEY (\`tagId\`) REFERENCES \`tags\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_tags\` ADD CONSTRAINT \`FK_4e6272e984c1987329d2d08b604\` FOREIGN KEY (\`circleId\`) REFERENCES \`social_circles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circles\` ADD CONSTRAINT \`FK_193c83ce6d4caa380cebdba8042\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_users\` ADD CONSTRAINT \`FK_aad9509ac5cf2026fa7aa11b3d7\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_users\` ADD CONSTRAINT \`FK_2d91f37f4b36b8b3fd9dd99f787\` FOREIGN KEY (\`circleId\`) REFERENCES \`social_circles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_fees\` ADD CONSTRAINT \`FK_6205661867e19294cfcb83417d2\` FOREIGN KEY (\`circleId\`) REFERENCES \`social_circles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_followers\` ADD CONSTRAINT \`FK_91ad19a82446d6970edca26735d\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_followers\` ADD CONSTRAINT \`FK_d61891025f1e30d09c8ada36fd4\` FOREIGN KEY (\`circleId\`) REFERENCES \`social_circles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_e44ddaaa6d058cb4092f83ad61f\` FOREIGN KEY (\`postId\`) REFERENCES \`social_circle_posts\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_7e8d7c49f218ebb14314fdb3749\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_8770bd9030a3d13c5f79a7d2e81\` FOREIGN KEY (\`parentId\`) REFERENCES \`comments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`comment_likes\` ADD CONSTRAINT \`FK_34d1f902a8a527dbc2502f87c88\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`comment_likes\` ADD CONSTRAINT \`FK_abbd506a94a424dd6a3a68d26f4\` FOREIGN KEY (\`commentId\`) REFERENCES \`comments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_post_likes\` ADD CONSTRAINT \`FK_7ad3480eff73fad2e4a9e652085\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_post_likes\` ADD CONSTRAINT \`FK_b1a8576b8b4aac096a782a3ed8f\` FOREIGN KEY (\`postId\`) REFERENCES \`social_circle_posts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_courses\` ADD CONSTRAINT \`FK_afd03c5ed6f96086b7efaf05b29\` FOREIGN KEY (\`circleId\`) REFERENCES \`social_circles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_sections\` ADD CONSTRAINT \`FK_ec9ab5fe4a56e1c7d502c73f75b\` FOREIGN KEY (\`chapterId\`) REFERENCES \`social_circle_chapters\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_chapters\` ADD CONSTRAINT \`FK_dab501dcf3e1e27ac975df3a029\` FOREIGN KEY (\`courseId\`) REFERENCES \`social_circle_courses\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_posts\` ADD CONSTRAINT \`FK_ef9b9fe982802ea5a6407af59d9\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_posts\` ADD CONSTRAINT \`FK_5344660f04a1d8a44b52dbd5bd8\` FOREIGN KEY (\`circleId\`) REFERENCES \`social_circles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_posts\` ADD CONSTRAINT \`FK_6b155bf4416ef5eeb9ffa9345a6\` FOREIGN KEY (\`sectionId\`) REFERENCES \`social_circle_sections\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
            `ALTER TABLE \`comment_upvoters\` ADD CONSTRAINT \`FK_b47c89751a0936881936ff78527\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`comment_upvoters\` ADD CONSTRAINT \`FK_79d76a35b2855320c5b79337bff\` FOREIGN KEY (\`commentId\`) REFERENCES \`comments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`comment_downvoters\` ADD CONSTRAINT \`FK_b0fe125ee2d06fd59588cb14218\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`comment_downvoters\` ADD CONSTRAINT \`FK_3e17e94446b67519d01bdac443d\` FOREIGN KEY (\`commentId\`) REFERENCES \`comments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`content_posts_tags_content_tags\` ADD CONSTRAINT \`FK_1e8c41827d0d509e70de1f6b70e\` FOREIGN KEY (\`contentPostsId\`) REFERENCES \`content_posts\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`content_posts_tags_content_tags\` ADD CONSTRAINT \`FK_888e6754015ee17f9e22faae578\` FOREIGN KEY (\`contentTagsId\`) REFERENCES \`content_tags\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`content_posts_tags_content_tags\` DROP FOREIGN KEY \`FK_888e6754015ee17f9e22faae578\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`content_posts_tags_content_tags\` DROP FOREIGN KEY \`FK_1e8c41827d0d509e70de1f6b70e\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`comment_downvoters\` DROP FOREIGN KEY \`FK_3e17e94446b67519d01bdac443d\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`comment_downvoters\` DROP FOREIGN KEY \`FK_b0fe125ee2d06fd59588cb14218\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`comment_upvoters\` DROP FOREIGN KEY \`FK_79d76a35b2855320c5b79337bff\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`comment_upvoters\` DROP FOREIGN KEY \`FK_b47c89751a0936881936ff78527\``,
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
            `ALTER TABLE \`social_circle_posts\` DROP FOREIGN KEY \`FK_6b155bf4416ef5eeb9ffa9345a6\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_posts\` DROP FOREIGN KEY \`FK_5344660f04a1d8a44b52dbd5bd8\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_posts\` DROP FOREIGN KEY \`FK_ef9b9fe982802ea5a6407af59d9\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_chapters\` DROP FOREIGN KEY \`FK_dab501dcf3e1e27ac975df3a029\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_sections\` DROP FOREIGN KEY \`FK_ec9ab5fe4a56e1c7d502c73f75b\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_courses\` DROP FOREIGN KEY \`FK_afd03c5ed6f96086b7efaf05b29\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_post_likes\` DROP FOREIGN KEY \`FK_b1a8576b8b4aac096a782a3ed8f\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_post_likes\` DROP FOREIGN KEY \`FK_7ad3480eff73fad2e4a9e652085\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`comment_likes\` DROP FOREIGN KEY \`FK_abbd506a94a424dd6a3a68d26f4\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`comment_likes\` DROP FOREIGN KEY \`FK_34d1f902a8a527dbc2502f87c88\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_8770bd9030a3d13c5f79a7d2e81\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_7e8d7c49f218ebb14314fdb3749\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_e44ddaaa6d058cb4092f83ad61f\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_followers\` DROP FOREIGN KEY \`FK_d61891025f1e30d09c8ada36fd4\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_followers\` DROP FOREIGN KEY \`FK_91ad19a82446d6970edca26735d\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_fees\` DROP FOREIGN KEY \`FK_6205661867e19294cfcb83417d2\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_users\` DROP FOREIGN KEY \`FK_2d91f37f4b36b8b3fd9dd99f787\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_users\` DROP FOREIGN KEY \`FK_aad9509ac5cf2026fa7aa11b3d7\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circles\` DROP FOREIGN KEY \`FK_193c83ce6d4caa380cebdba8042\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_tags\` DROP FOREIGN KEY \`FK_4e6272e984c1987329d2d08b604\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`social_circle_tags\` DROP FOREIGN KEY \`FK_33567f5c25b5374be1d879e350a\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_access_tokens\` DROP FOREIGN KEY \`FK_71a030e491d5c8547fc1e38ef82\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_refresh_tokens\` DROP FOREIGN KEY \`FK_1dfd080c2abf42198691b60ae39\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`content_categories\` DROP FOREIGN KEY \`FK_a03aea27707893300382b6f18ae\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`content_posts\` DROP FOREIGN KEY \`FK_4027367881933f659d02f367e92\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`content_comments\` DROP FOREIGN KEY \`FK_5e1c3747a0031f305e94493361f\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`content_comments\` DROP FOREIGN KEY \`FK_982a849f676860e5d6beb607f20\``,
        );
        await queryRunner.query(
            `DROP INDEX \`IDX_888e6754015ee17f9e22faae57\` ON \`content_posts_tags_content_tags\``,
        );
        await queryRunner.query(
            `DROP INDEX \`IDX_1e8c41827d0d509e70de1f6b70\` ON \`content_posts_tags_content_tags\``,
        );
        await queryRunner.query(`DROP TABLE \`content_posts_tags_content_tags\``);
        await queryRunner.query(`DROP INDEX \`uniq_user_post\` ON \`feeds\``);
        await queryRunner.query(`DROP INDEX \`idx_circle_user\` ON \`feeds\``);
        await queryRunner.query(`DROP INDEX \`idx_publishTime\` ON \`feeds\``);
        await queryRunner.query(`DROP TABLE \`feeds\``);
        await queryRunner.query(`DROP INDEX \`uniq_user_comment\` ON \`comment_downvoters\``);
        await queryRunner.query(`DROP INDEX \`idx_comment\` ON \`comment_downvoters\``);
        await queryRunner.query(`DROP TABLE \`comment_downvoters\``);
        await queryRunner.query(`DROP INDEX \`uniq_user_comment\` ON \`comment_upvoters\``);
        await queryRunner.query(`DROP INDEX \`idx_comment\` ON \`comment_upvoters\``);
        await queryRunner.query(`DROP TABLE \`comment_upvoters\``);
        await queryRunner.query(`DROP INDEX \`uniq_collect_post\` ON \`collect_posts\``);
        await queryRunner.query(`DROP INDEX \`idx_collect\` ON \`collect_posts\``);
        await queryRunner.query(`DROP TABLE \`collect_posts\``);
        await queryRunner.query(`DROP INDEX \`idx_user\` ON \`collects\``);
        await queryRunner.query(`DROP TABLE \`collects\``);
        await queryRunner.query(`DROP INDEX \`idx_user\` ON \`social_circle_posts\``);
        await queryRunner.query(`DROP INDEX \`idx_circle_createdAt\` ON \`social_circle_posts\``);
        await queryRunner.query(
            `DROP INDEX \`idx_circle_section_createdAt\` ON \`social_circle_posts\``,
        );
        await queryRunner.query(
            `DROP INDEX \`idx_circle_commentCount\` ON \`social_circle_posts\``,
        );
        await queryRunner.query(`DROP INDEX \`idx_circle_likeCount\` ON \`social_circle_posts\``);
        await queryRunner.query(`DROP TABLE \`social_circle_posts\``);
        await queryRunner.query(
            `DROP INDEX \`idx_course_createdAt\` ON \`social_circle_chapters\``,
        );
        await queryRunner.query(`DROP TABLE \`social_circle_chapters\``);
        await queryRunner.query(
            `DROP INDEX \`idx_chapter_createdAt\` ON \`social_circle_sections\``,
        );
        await queryRunner.query(`DROP TABLE \`social_circle_sections\``);
        await queryRunner.query(`DROP INDEX \`idx_circle_createdAt\` ON \`social_circle_courses\``);
        await queryRunner.query(`DROP TABLE \`social_circle_courses\``);
        await queryRunner.query(`DROP INDEX \`uniq_user_post\` ON \`social_circle_post_likes\``);
        await queryRunner.query(`DROP INDEX \`idx_post\` ON \`social_circle_post_likes\``);
        await queryRunner.query(`DROP TABLE \`social_circle_post_likes\``);
        await queryRunner.query(`DROP INDEX \`uniq_user_comment\` ON \`comment_likes\``);
        await queryRunner.query(`DROP INDEX \`idx_comment\` ON \`comment_likes\``);
        await queryRunner.query(`DROP TABLE \`comment_likes\``);
        await queryRunner.query(`DROP INDEX \`idx_mpath\` ON \`comments\``);
        await queryRunner.query(`DROP INDEX \`idx_post\` ON \`comments\``);
        await queryRunner.query(`DROP INDEX \`idx_user\` ON \`comments\``);
        await queryRunner.query(`DROP INDEX \`IDX_7e8d7c49f218ebb14314fdb374\` ON \`comments\``);
        await queryRunner.query(`DROP INDEX \`IDX_e44ddaaa6d058cb4092f83ad61\` ON \`comments\``);
        await queryRunner.query(`DROP TABLE \`comments\``);
        await queryRunner.query(`DROP INDEX \`uniq_circel_user\` ON \`social_circle_followers\``);
        await queryRunner.query(
            `DROP INDEX \`idx_circel_createdAt\` ON \`social_circle_followers\``,
        );
        await queryRunner.query(`DROP INDEX \`idx_user_createdAt\` ON \`social_circle_followers\``);
        await queryRunner.query(`DROP TABLE \`social_circle_followers\``);
        await queryRunner.query(`DROP TABLE \`social_circle_fees\``);
        await queryRunner.query(`DROP INDEX \`uniq_circel_user\` ON \`social_circle_users\``);
        await queryRunner.query(`DROP INDEX \`idx_circel_createdAt\` ON \`social_circle_users\``);
        await queryRunner.query(`DROP INDEX \`idx_user_createdAt\` ON \`social_circle_users\``);
        await queryRunner.query(`DROP TABLE \`social_circle_users\``);
        await queryRunner.query(`DROP INDEX \`uniq_name\` ON \`social_circles\``);
        await queryRunner.query(`DROP INDEX \`idx_user\` ON \`social_circles\``);
        await queryRunner.query(`DROP TABLE \`social_circles\``);
        await queryRunner.query(`DROP INDEX \`uniq_circel_tag\` ON \`social_circle_tags\``);
        await queryRunner.query(`DROP TABLE \`social_circle_tags\``);
        await queryRunner.query(`DROP INDEX \`uniq_name\` ON \`tags\``);
        await queryRunner.query(`DROP TABLE \`tags\``);
        await queryRunner.query(`DROP INDEX \`idx_circle_sendTime\` ON \`chat_messages\``);
        await queryRunner.query(`DROP TABLE \`chat_messages\``);
        await queryRunner.query(`DROP TABLE \`user_access_tokens\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_a000cca60bcf04454e72769949\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(
            `DROP INDEX \`REL_1dfd080c2abf42198691b60ae3\` ON \`user_refresh_tokens\``,
        );
        await queryRunner.query(`DROP TABLE \`user_refresh_tokens\``);
        await queryRunner.query(
            `DROP INDEX \`IDX_d6aaf8517ca57297a8c3a44d3d\` ON \`content_categories\``,
        );
        await queryRunner.query(`DROP TABLE \`content_categories\``);
        await queryRunner.query(
            `DROP INDEX \`IDX_f43723dc196c18767a3893a3f7\` ON \`content_posts\``,
        );
        await queryRunner.query(
            `DROP INDEX \`IDX_e51068c39974ca11fae5d44c88\` ON \`content_posts\``,
        );
        await queryRunner.query(
            `DROP INDEX \`IDX_9ef6db9d13df6882d36c8af0cc\` ON \`content_posts\``,
        );
        await queryRunner.query(`DROP TABLE \`content_posts\``);
        await queryRunner.query(
            `DROP INDEX \`IDX_6f504a08a58010e15c55b1eb23\` ON \`content_tags\``,
        );
        await queryRunner.query(`DROP TABLE \`content_tags\``);
        await queryRunner.query(
            `DROP INDEX \`IDX_5f70a0489331d4346e46ea4d88\` ON \`content_comments\``,
        );
        await queryRunner.query(`DROP TABLE \`content_comments\``);
    }
}

module.exports = AtkXQZ1703563311003;
