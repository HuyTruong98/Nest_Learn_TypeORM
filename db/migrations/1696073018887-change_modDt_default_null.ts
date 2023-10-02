import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeModDtDefaultNull1696073018887 implements MigrationInterface {
  name = 'ChangeModDtDefaultNull1696073018887';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`post\` CHANGE \`modDt\` \`modDt\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`post\` CHANGE \`modDt\` \`modDt\` varchar(255) NOT NULL`,
    );
  }
}
