import { MigrationInterface, QueryRunner } from "typeorm";

export class Pruebas41757745419405 implements MigrationInterface {
    name = 'Pruebas41757745419405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "academic"."program" ADD "enrollment_fee" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "academic"."program" DROP COLUMN "enrollment_fee"`);
    }

}
