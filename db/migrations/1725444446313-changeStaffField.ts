import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeStaffField1725444446313 implements MigrationInterface {
    name = 'ChangeStaffField1725444446313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`staff_avatar\` CHANGE \`file_name\` \`file_name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`staff_avatar\` CHANGE \`file_folder\` \`file_folder\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`staff_avatar\` CHANGE \`file_url\` \`file_url\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`staff_avatar\` CHANGE \`file_type\` \`file_type\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`staff_avatar\` CHANGE \`cloud_id\` \`cloud_id\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`staff_avatar\` CHANGE \`cloud_id\` \`cloud_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`staff_avatar\` CHANGE \`file_type\` \`file_type\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`staff_avatar\` CHANGE \`file_url\` \`file_url\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`staff_avatar\` CHANGE \`file_folder\` \`file_folder\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`staff_avatar\` CHANGE \`file_name\` \`file_name\` varchar(255) NOT NULL`);
    }

}
