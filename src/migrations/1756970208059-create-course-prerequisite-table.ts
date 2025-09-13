import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCoursePrerequisiteTable1756970208059 implements MigrationInterface {
    name = 'CreateCoursePrerequisiteTable1756970208059'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "academic"."course_prerequisite" ("prereq_id" SERIAL NOT NULL, "course_id" integer NOT NULL, "prerequisite_course_id" integer NOT NULL, "type" character varying NOT NULL, "required_credits" integer NOT NULL, CONSTRAINT "PK_181c5c32a0c0fd75db77b06e84c" PRIMARY KEY ("prereq_id"))`);
        await queryRunner.query(`ALTER TABLE "academic"."course_prerequisite" ADD CONSTRAINT "FK_9678cf7b818267a347774678be7" FOREIGN KEY ("course_id") REFERENCES "academic"."course"("course_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "academic"."academic_term" ADD CONSTRAINT "FK_b9969bbb94e79961f717df08846" FOREIGN KEY ("term_type_id") REFERENCES "academic"."term_type"("term_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "academic"."academic_term" DROP CONSTRAINT "FK_b9969bbb94e79961f717df08846"`);
        await queryRunner.query(`ALTER TABLE "academic"."course_prerequisite" DROP CONSTRAINT "FK_9678cf7b818267a347774678be7"`);
        await queryRunner.query(`DROP TABLE "academic"."course_prerequisite"`);
    }

}
