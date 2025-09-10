import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustNullableFields1757221877061 implements MigrationInterface {
    name = 'AdjustNullableFields1757221877061'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" DROP COLUMN "semester"`);
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" DROP COLUMN "year"`);
        await queryRunner.query(`ALTER TABLE "academic"."course_prerequisite" ALTER COLUMN "prerequisite_course_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "academic"."course_prerequisite" ALTER COLUMN "required_credits" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "academic"."course_prerequisite" ALTER COLUMN "required_credits" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "academic"."course_prerequisite" ALTER COLUMN "prerequisite_course_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" ADD "year" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" ADD "semester" character varying NOT NULL`);
    }

}
