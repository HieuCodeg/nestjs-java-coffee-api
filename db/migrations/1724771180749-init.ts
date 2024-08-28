import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1724771180749 implements MigrationInterface {
    name = 'Init1724771180749'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL, \`name\` enum ('ROLE_ADMIN', 'ROLE_CASHIER', 'ROLE_STAFF', 'ROLE_CUSTOMER') NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`deleted\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` varchar(255) NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` varchar(255) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`is_first_login\` tinyint NOT NULL, \`code_first_login\` varchar(255) NULL, \`role_id\` int NOT NULL, UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`staff_avatar\` (\`id\` varchar(36) NOT NULL, \`file_name\` varchar(255) NOT NULL, \`file_folder\` varchar(255) NOT NULL, \`file_url\` varchar(255) NOT NULL, \`file_type\` varchar(255) NOT NULL, \`cloud_id\` varchar(255) NOT NULL, \`ts\` bigint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`location_region\` (\`deleted\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` varchar(255) NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` varchar(255) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`province_id\` varchar(255) NOT NULL, \`province_name\` varchar(255) NOT NULL, \`district_id\` varchar(255) NOT NULL, \`district_name\` varchar(255) NOT NULL, \`ward_id\` varchar(255) NOT NULL, \`ward_name\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`staffs\` (\`deleted\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` varchar(255) NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` varchar(255) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`full_name\` varchar(255) NOT NULL, \`dob\` date NOT NULL, \`gender\` varchar(10) NOT NULL, \`phone\` varchar(255) NOT NULL, \`location_region_id\` int NULL, \`user_id\` int NOT NULL, \`staff_avatar_id\` varchar(36) NULL, UNIQUE INDEX \`IDX_b8e8f265ec3a2c739ed716c40f\` (\`phone\`), UNIQUE INDEX \`REL_87dc9d9436479efe21020b72a6\` (\`location_region_id\`), UNIQUE INDEX \`REL_7953eac210a0e34a3e82a3c533\` (\`user_id\`), UNIQUE INDEX \`REL_eaafc16eba46fe58b629c2085c\` (\`staff_avatar_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_images\` (\`deleted\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` varchar(255) NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` varchar(255) NULL, \`id\` varchar(36) NOT NULL, \`file_name\` varchar(255) NULL, \`file_folder\` varchar(255) NULL, \`file_url\` varchar(255) NULL, \`file_type\` varchar(255) NULL, \`cloud_id\` varchar(255) NULL, \`height\` int NULL, \`width\` int NULL, \`ts\` bigint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categories\` (\`deleted\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` varchar(255) NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` varchar(255) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_aa79448dc3e959720ab4c13651\` (\`title\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`products\` (\`deleted\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` varchar(255) NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` varchar(255) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(50) NOT NULL, \`summary\` varchar(255) NULL, \`description\` varchar(255) NULL, \`sizes\` json NULL, \`category_id\` int NULL, \`product_image_id\` varchar(36) NULL, UNIQUE INDEX \`REL_9a5f6868c96e0069e699f33e12\` (\`category_id\`), UNIQUE INDEX \`REL_99371aa4a66a080b552a8780a2\` (\`product_image_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tables\` (\`deleted\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` varchar(255) NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` varchar(255) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`status\` enum ('Trống', 'Mở', 'Nhập bếp', 'Đã phục vụ') NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orders\` (\`deleted\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` varchar(255) NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` varchar(255) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`total_amount\` decimal(12,0) NOT NULL, \`status_order\` varchar(50) NOT NULL, \`table_id\` int NOT NULL, \`staff_id\` int NOT NULL, UNIQUE INDEX \`REL_3d36410e89a795172fa6e0dd96\` (\`table_id\`), UNIQUE INDEX \`REL_40337bbb0e0cc7113dc3037fc6\` (\`staff_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order_items\` (\`deleted\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` varchar(255) NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` varchar(255) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`size\` varchar(255) NOT NULL, \`price\` int NOT NULL, \`quantity\` int NOT NULL, \`quantityDelivery\` int NOT NULL, \`amount\` int NOT NULL, \`note\` varchar(255) NULL, \`tableId\` bigint NULL, \`orderItemStatus\` enum ('Mới', 'Đang làm', 'Chờ cung ứng', 'Đã giao', 'Hoàn tất') NOT NULL, \`product_id\` int NULL, \`order_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`otps\` (\`deleted\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` varchar(255) NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` varchar(255) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL, \`user_id\` int NULL, UNIQUE INDEX \`REL_3938bb24b38ad395af30230bde\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`database_check\` (\`id\` int NOT NULL, \`product_check\` int NOT NULL, \`table_check\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`customers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`full_name\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`balance\` decimal(12,0) NOT NULL, \`location_region_id\` int NULL, \`user_id\` int NOT NULL, UNIQUE INDEX \`IDX_88acd889fbe17d0e16cc4bc917\` (\`phone\`), UNIQUE INDEX \`REL_dcd9f1602266b2a247ef602289\` (\`location_region_id\`), UNIQUE INDEX \`REL_11d81cd7be87b6f8865b0cf766\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`customer_avatar\` (\`id\` varchar(36) NOT NULL, \`file_name\` varchar(255) NOT NULL, \`file_folder\` varchar(255) NOT NULL, \`file_url\` varchar(255) NOT NULL, \`file_type\` varchar(255) NOT NULL, \`cloud_id\` varchar(255) NOT NULL, \`ts\` bigint NOT NULL DEFAULT 0, \`customer_id\` int NULL, UNIQUE INDEX \`REL_f1398a2ac94998fa6f78dc320b\` (\`customer_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_a2cecd1a3531c0b041e29ba46e1\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`staffs\` ADD CONSTRAINT \`FK_87dc9d9436479efe21020b72a64\` FOREIGN KEY (\`location_region_id\`) REFERENCES \`location_region\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`staffs\` ADD CONSTRAINT \`FK_7953eac210a0e34a3e82a3c5332\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`staffs\` ADD CONSTRAINT \`FK_eaafc16eba46fe58b629c2085c3\` FOREIGN KEY (\`staff_avatar_id\`) REFERENCES \`staff_avatar\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_9a5f6868c96e0069e699f33e124\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_99371aa4a66a080b552a8780a26\` FOREIGN KEY (\`product_image_id\`) REFERENCES \`product_images\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_3d36410e89a795172fa6e0dd968\` FOREIGN KEY (\`table_id\`) REFERENCES \`tables\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_40337bbb0e0cc7113dc3037fc60\` FOREIGN KEY (\`staff_id\`) REFERENCES \`staffs\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_9263386c35b6b242540f9493b00\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_145532db85752b29c57d2b7b1f1\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`otps\` ADD CONSTRAINT \`FK_3938bb24b38ad395af30230bded\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`customers\` ADD CONSTRAINT \`FK_dcd9f1602266b2a247ef602289d\` FOREIGN KEY (\`location_region_id\`) REFERENCES \`location_region\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`customers\` ADD CONSTRAINT \`FK_11d81cd7be87b6f8865b0cf7661\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`customer_avatar\` ADD CONSTRAINT \`FK_f1398a2ac94998fa6f78dc320b2\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customer_avatar\` DROP FOREIGN KEY \`FK_f1398a2ac94998fa6f78dc320b2\``);
        await queryRunner.query(`ALTER TABLE \`customers\` DROP FOREIGN KEY \`FK_11d81cd7be87b6f8865b0cf7661\``);
        await queryRunner.query(`ALTER TABLE \`customers\` DROP FOREIGN KEY \`FK_dcd9f1602266b2a247ef602289d\``);
        await queryRunner.query(`ALTER TABLE \`otps\` DROP FOREIGN KEY \`FK_3938bb24b38ad395af30230bded\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_145532db85752b29c57d2b7b1f1\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_9263386c35b6b242540f9493b00\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_40337bbb0e0cc7113dc3037fc60\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_3d36410e89a795172fa6e0dd968\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_99371aa4a66a080b552a8780a26\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_9a5f6868c96e0069e699f33e124\``);
        await queryRunner.query(`ALTER TABLE \`staffs\` DROP FOREIGN KEY \`FK_eaafc16eba46fe58b629c2085c3\``);
        await queryRunner.query(`ALTER TABLE \`staffs\` DROP FOREIGN KEY \`FK_7953eac210a0e34a3e82a3c5332\``);
        await queryRunner.query(`ALTER TABLE \`staffs\` DROP FOREIGN KEY \`FK_87dc9d9436479efe21020b72a64\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_a2cecd1a3531c0b041e29ba46e1\``);
        await queryRunner.query(`DROP INDEX \`REL_f1398a2ac94998fa6f78dc320b\` ON \`customer_avatar\``);
        await queryRunner.query(`DROP TABLE \`customer_avatar\``);
        await queryRunner.query(`DROP INDEX \`REL_11d81cd7be87b6f8865b0cf766\` ON \`customers\``);
        await queryRunner.query(`DROP INDEX \`REL_dcd9f1602266b2a247ef602289\` ON \`customers\``);
        await queryRunner.query(`DROP INDEX \`IDX_88acd889fbe17d0e16cc4bc917\` ON \`customers\``);
        await queryRunner.query(`DROP TABLE \`customers\``);
        await queryRunner.query(`DROP TABLE \`database_check\``);
        await queryRunner.query(`DROP INDEX \`REL_3938bb24b38ad395af30230bde\` ON \`otps\``);
        await queryRunner.query(`DROP TABLE \`otps\``);
        await queryRunner.query(`DROP TABLE \`order_items\``);
        await queryRunner.query(`DROP INDEX \`REL_40337bbb0e0cc7113dc3037fc6\` ON \`orders\``);
        await queryRunner.query(`DROP INDEX \`REL_3d36410e89a795172fa6e0dd96\` ON \`orders\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
        await queryRunner.query(`DROP TABLE \`tables\``);
        await queryRunner.query(`DROP INDEX \`REL_99371aa4a66a080b552a8780a2\` ON \`products\``);
        await queryRunner.query(`DROP INDEX \`REL_9a5f6868c96e0069e699f33e12\` ON \`products\``);
        await queryRunner.query(`DROP TABLE \`products\``);
        await queryRunner.query(`DROP INDEX \`IDX_aa79448dc3e959720ab4c13651\` ON \`categories\``);
        await queryRunner.query(`DROP TABLE \`categories\``);
        await queryRunner.query(`DROP TABLE \`product_images\``);
        await queryRunner.query(`DROP INDEX \`REL_eaafc16eba46fe58b629c2085c\` ON \`staffs\``);
        await queryRunner.query(`DROP INDEX \`REL_7953eac210a0e34a3e82a3c533\` ON \`staffs\``);
        await queryRunner.query(`DROP INDEX \`REL_87dc9d9436479efe21020b72a6\` ON \`staffs\``);
        await queryRunner.query(`DROP INDEX \`IDX_b8e8f265ec3a2c739ed716c40f\` ON \`staffs\``);
        await queryRunner.query(`DROP TABLE \`staffs\``);
        await queryRunner.query(`DROP TABLE \`location_region\``);
        await queryRunner.query(`DROP TABLE \`staff_avatar\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
    }

}
