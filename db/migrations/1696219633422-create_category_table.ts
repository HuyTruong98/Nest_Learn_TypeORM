import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCategoryTable1696219633422 implements MigrationInterface {
    name = 'CreateCategoryTable1696219633422'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`status\` int NOT NULL DEFAULT '1', \`regDt\` varchar(255) NOT NULL, \`modDt\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`categoryId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_1077d47e0112cad3c16bbcea6cd\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_1077d47e0112cad3c16bbcea6cd\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`categoryId\``);
        await queryRunner.query(`DROP TABLE \`category\``);
    }

}
