import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePostTable1696046814125 implements MigrationInterface {
  name = 'CreatePostTable1696046814125';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`post\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`thumbnail\` varchar(255) NOT NULL, \`status\` int NOT NULL DEFAULT '1', \`regDt\` varchar(255) NOT NULL, \`modDt\` varchar(255) NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`post\` ADD CONSTRAINT \`FK_5c1cf55c308037b5aca1038a131\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_5c1cf55c308037b5aca1038a131\``,
    );
    await queryRunner.query(`DROP TABLE \`post\``);
  }
}
