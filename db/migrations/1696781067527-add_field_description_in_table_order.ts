import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldDescriptionInTableOrder1696781067527 implements MigrationInterface {
    name = 'AddFieldDescriptionInTableOrder1696781067527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`description\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`description\``);
    }

}
