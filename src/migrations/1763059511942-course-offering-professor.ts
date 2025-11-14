import { MigrationInterface, QueryRunner } from "typeorm";

export class CourseOfferingProfessor1763059511942 implements MigrationInterface {
    name = 'CourseOfferingProfessor1763059511942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" RENAME COLUMN "professor" TO "professor_id"`);
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" DROP COLUMN "professor_id"`);
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" ADD "professor_id" integer`);
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" ADD CONSTRAINT "FK_7f93ba6f8d732d5b06d0c6afaf7" FOREIGN KEY ("professor_id") REFERENCES "professors"."professor"("professor_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" DROP CONSTRAINT "FK_7f93ba6f8d732d5b06d0c6afaf7"`);
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" DROP COLUMN "professor_id"`);
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" ADD "professor_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "academic"."course_offering" RENAME COLUMN "professor_id" TO "professor"`);
    }

}
