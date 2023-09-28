import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeFieldRegDt1695890406454 implements MigrationInterface {
  name = 'ChangeFieldRegDt1695890406454';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`regDt\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`regDt\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`modDt\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`modDt\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`modDt\``);
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`modDt\` datetime NULL`);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`regDt\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`regDt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
  }
}
