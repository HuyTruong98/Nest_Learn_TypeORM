import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddFieldAvatar1695920386543 implements MigrationInterface {
  name = 'AddFieldAvatar1695920386543';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const columns = await queryRunner.query(
      `SHOW COLUMNS FROM \`user\` LIKE 'avatar'`,
    );

    if (columns.length === 0) {
      await queryRunner.addColumn(
        'user',
        new TableColumn({
          name: 'avatar',
          type: 'varchar(255)',
          isNullable: true,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'avatar');
  }
}
