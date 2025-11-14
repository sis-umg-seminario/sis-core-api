import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStudentGradesTable1763082384651 implements MigrationInterface {
    name = 'CreateStudentGradesTable1763082384651'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "academic"."grade_category" ("grade_category_id" SERIAL NOT NULL, "description" character varying NOT NULL, "identifier" character varying NOT NULL, "weight" integer NOT NULL, "max_score" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a98778a9df4bf0ebc7956a16b34" PRIMARY KEY ("grade_category_id"))`);
        await queryRunner.query(`CREATE TABLE "students"."student_grade" ("student_grade_id" SERIAL NOT NULL, "enrollment_course_id" integer NOT NULL, "grade_category_id" integer NOT NULL, "score" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "submitted_by" integer NOT NULL, CONSTRAINT "PK_159f8999ae1e9d8f9890352c3f5" PRIMARY KEY ("student_grade_id"))`);
        await queryRunner.query(`ALTER TABLE "students"."student_grade" ADD CONSTRAINT "FK_d315813688e858fec87c1dcf5f5" FOREIGN KEY ("enrollment_course_id") REFERENCES "enrollments"."enrollment_course"("enrollment_course_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students"."student_grade" ADD CONSTRAINT "FK_d74dba5c51803bf49bc4f324455" FOREIGN KEY ("grade_category_id") REFERENCES "academic"."grade_category"("grade_category_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students"."student_grade" ADD CONSTRAINT "FK_ddbe1812d58df775906a492e207" FOREIGN KEY ("submitted_by") REFERENCES "professors"."professor"("professor_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "students"."student_grade" DROP CONSTRAINT "FK_ddbe1812d58df775906a492e207"`);
        await queryRunner.query(`ALTER TABLE "students"."student_grade" DROP CONSTRAINT "FK_d74dba5c51803bf49bc4f324455"`);
        await queryRunner.query(`ALTER TABLE "students"."student_grade" DROP CONSTRAINT "FK_d315813688e858fec87c1dcf5f5"`);
        await queryRunner.query(`DROP TABLE "students"."student_grade"`);
        await queryRunner.query(`DROP TABLE "academic"."grade_category"`);
    }

}
