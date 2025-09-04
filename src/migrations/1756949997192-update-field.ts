import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateField1756949997192 implements MigrationInterface {
    name = 'UpdateField1756949997192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "example"."table2" RENAME COLUMN "moredata" TO "metadata"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "example"."table2" RENAME COLUMN "metadata" TO "moredata"`);
    }

}
