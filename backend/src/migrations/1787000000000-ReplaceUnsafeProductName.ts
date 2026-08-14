import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReplaceUnsafeProductName1787000000000 implements MigrationInterface {
  name = 'ReplaceUnsafeProductName1787000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "products" SET "name" = 'Cinta de correr plegable' WHERE "name" = '<script>alert(1)</script>'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "products" SET "name" = '<script>alert(1)</script>' WHERE "name" = 'Cinta de correr plegable'`,
    );
  }
}
