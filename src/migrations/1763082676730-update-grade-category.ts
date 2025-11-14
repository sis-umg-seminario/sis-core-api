import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateGradeCategory1763082676730 implements MigrationInterface {
    name = 'UpdateGradeCategory1763082676730'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "academic"."grade_category" DROP COLUMN "weight"`);
        await queryRunner.query(`ALTER TABLE "academic"."grade_category" ADD "weight" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "academic"."grade_category" DROP COLUMN "weight"`);
        await queryRunner.query(`ALTER TABLE "academic"."grade_category" ADD "weight" integer NOT NULL`);
    }

}
