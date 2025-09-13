import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustNullableFields1757222311804 implements MigrationInterface {
    name = 'AdjustNullableFields1757222311804'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments"."payment_type" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "students"."student_program" ALTER COLUMN "created_at" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "students"."student_program" ALTER COLUMN "created_at" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "payments"."payment_type" DROP COLUMN "created_at"`);
    }

}
