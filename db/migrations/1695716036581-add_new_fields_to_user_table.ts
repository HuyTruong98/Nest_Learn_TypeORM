import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewFieldsToUserTable1695716036581
  implements MigrationInterface
{
  name = 'AddNewFieldsToUserTable1695716036581';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`refresh_token\` varchar(255) NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`regDt\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`regDt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`modDt\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`modDt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`modDt\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`modDt\` varchar(255) NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`regDt\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`regDt\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`refresh_token\``,
    );
  }
}
