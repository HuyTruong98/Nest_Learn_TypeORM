import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeFieldModDtType1695719135934 implements MigrationInterface {
  name = 'ChangeFieldModDtType1695719135934';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`modDt\` \`modDt\` datetime NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`modDt\` \`modDt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
  }
}
