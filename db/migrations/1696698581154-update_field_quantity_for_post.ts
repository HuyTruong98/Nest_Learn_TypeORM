import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFieldQuantityForPost1696698581154 implements MigrationInterface {
    name = 'UpdateFieldQuantityForPost1696698581154'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`quantity\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`quantity\``);
    }

}
